from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models
import schemas
from auth import require_mentor, get_current_user

router = APIRouter(prefix="/mentor", tags=["Mentor"])


def recalculate_percent(db: Session, g_id: int):
    """Auto-recalculate goal percent based on checkpoints."""
    checkpoints = db.query(models.Checkpoint).filter(models.Checkpoint.g_id == g_id).all()
    if not checkpoints:
        percent = 0.0
    else:
        done = sum(1 for cp in checkpoints if cp.is_done)
        percent = round((done / len(checkpoints)) * 100, 1)
    goal = db.query(models.Goal).filter(models.Goal.g_id == g_id).first()
    goal.percent = percent
    db.commit()


@router.post("/{ms_id}/goal", response_model=schemas.GoalResponse)
def create_goal(
    ms_id: int,
    g_data: schemas.GoalCreate,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    mentorship = db.query(models.Mentorship).filter(
        models.Mentorship.ms_id == ms_id,
        models.Mentorship.mentor_id == mentor.emp_id
    ).first()
    if not mentorship:
        raise HTTPException(status_code=404, detail="Mentorship not found or you are not the mentor")

    new_goal = models.Goal(
        ms_id=ms_id,
        title=g_data.title,
        desc=g_data.desc,
        deadline=g_data.deadline,
        percent=0.0
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return db.query(models.Goal).options(
        joinedload(models.Goal.checkpoints)
    ).filter(models.Goal.g_id == new_goal.g_id).first()


@router.get("/{ms_id}/goals", response_model=list[schemas.GoalResponse])
def get_mentee_goals(
    ms_id: int,
    db: Session = Depends(get_db),
    user: models.Employee = Depends(get_current_user)
):
    mentorship = db.query(models.Mentorship).filter(
        models.Mentorship.ms_id == ms_id
    ).first()
    if not mentorship:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    if user.emp_id not in (mentorship.mentor_id, mentorship.mentee_id):
        raise HTTPException(status_code=403, detail="You are not part of this mentorship")

    return db.query(models.Goal).options(
        joinedload(models.Goal.checkpoints)
    ).filter(models.Goal.ms_id == ms_id).all()

@router.post("/goal/{g_id}/checkpoint", response_model=schemas.CheckpointResponse)
def add_checkpoint(
    g_id: int,
    data: schemas.CheckpointCreate,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    goal = db.query(models.Goal).filter(models.Goal.g_id == g_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    mentorship = db.query(models.Mentorship).filter(
        models.Mentorship.ms_id == goal.ms_id,
        models.Mentorship.mentor_id == mentor.emp_id
    ).first()
    if not mentorship:
        raise HTTPException(status_code=403, detail="You are not the mentor for this goal")

    cp = models.Checkpoint(g_id=g_id, text=data.text, is_done=False)
    db.add(cp)
    db.commit()
    db.refresh(cp)

    recalculate_percent(db, g_id)
    return cp


@router.patch("/goal/{g_id}/checkpoint/{cp_id}", response_model=schemas.GoalResponse)
def toggle_checkpoint(
    g_id: int,
    cp_id: int,
    data: schemas.CheckpointToggle,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    goal = db.query(models.Goal).filter(models.Goal.g_id == g_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    mentorship = db.query(models.Mentorship).filter(
        models.Mentorship.ms_id == goal.ms_id,
        models.Mentorship.mentor_id == mentor.emp_id
    ).first()
    if not mentorship:
        raise HTTPException(status_code=403, detail="You are not the mentor for this goal")

    cp = db.query(models.Checkpoint).filter(
        models.Checkpoint.cp_id == cp_id,
        models.Checkpoint.g_id == g_id
    ).first()
    if not cp:
        raise HTTPException(status_code=404, detail="Checkpoint not found")

    cp.is_done = data.is_done
    db.commit()

    recalculate_percent(db, g_id)

    return db.query(models.Goal).options(
        joinedload(models.Goal.checkpoints)
    ).filter(models.Goal.g_id == g_id).first()


@router.delete("/goal/{g_id}/checkpoint/{cp_id}")
def delete_checkpoint(
    g_id: int,
    cp_id: int,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    goal = db.query(models.Goal).filter(models.Goal.g_id == g_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    mentorship = db.query(models.Mentorship).filter(
        models.Mentorship.ms_id == goal.ms_id,
        models.Mentorship.mentor_id == mentor.emp_id
    ).first()
    if not mentorship:
        raise HTTPException(status_code=403, detail="You are not the mentor for this goal")

    cp = db.query(models.Checkpoint).filter(
        models.Checkpoint.cp_id == cp_id,
        models.Checkpoint.g_id == g_id
    ).first()
    if not cp:
        raise HTTPException(status_code=404, detail="Checkpoint not found")

    db.delete(cp)
    db.commit()

    recalculate_percent(db, g_id)

    return {"message": "Checkpoint deleted"}
