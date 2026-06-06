from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models
import schemas
from auth import require_mentor_eligible, get_current_user, require_practiceHead
from datetime import datetime

router = APIRouter(prefix="/mentor", tags=["Mentor"])


@router.post("/mapp", response_model=schemas.MentorApplicationResponse, status_code=201)
def apply_mentorship(
    mentor_data: schemas.MentorApplication,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor_eligible)
):
    existing = db.query(models.MentorApplication).filter(
        models.MentorApplication.emp_id == mentor.emp_id,
        models.MentorApplication.skill_id == mentor_data.skill_id,
        models.MentorApplication.status == "Pending"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Application already exists")

    new_app = models.MentorApplication(
        emp_id=mentor.emp_id,
        status="Pending",
        skill_id=mentor_data.skill_id,
        submitted_at=datetime.now().date(),
        approved_by=None,
        approved_at=None
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return db.query(models.MentorApplication).options(
        joinedload(models.MentorApplication.employee),
        joinedload(models.MentorApplication.skill)
    ).filter(models.MentorApplication.ma_id == new_app.ma_id).first()

@router.get("/mapp/all", response_model=list[schemas.MentorApplicationResponse])
def get_all_mapp(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    query = db.query(models.MentorApplication).options(
        joinedload(models.MentorApplication.employee),
        joinedload(models.MentorApplication.skill)
    )
    if current_user.role_type == "Admin":
        return query.all()

    ph_skills = [s[0] for s in db.query(models.PracticeHead.skill_id).filter(
        models.PracticeHead.emp_id == current_user.emp_id
    ).all()]

    if ph_skills:
        return query.filter(models.MentorApplication.skill_id.in_(ph_skills)).all()

    raise HTTPException(status_code=403, detail="Only admins and practice heads can view applications")


@router.post("/mapprov", response_model=schemas.MentorApprovalResponse)
def mentor_approval(
    m_data: schemas.MentorApproval,
    db: Session = Depends(get_db),
    ph: models.PracticeHead = Depends(require_practiceHead)
):
    application = db.query(models.MentorApplication).filter(
        models.MentorApplication.ma_id == m_data.ma_id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.status == "Approved":
        raise HTTPException(status_code=400, detail="Already approved")

    ph_skill_ids = [
        row.skill_id for row in db.query(models.PracticeHead).filter(
            models.PracticeHead.emp_id == ph.emp_id
        ).all()
    ]

    if application.skill_id not in ph_skill_ids:
        raise HTTPException(status_code=403, detail="You can only approve for your own skill")

    application.status = "Approved"
    application.approved_at = datetime.now().date()
    application.approved_by = ph.employee.name

    new_mentor = models.Mentors(
        ma_id=application.ma_id,
        emp_id=application.emp_id,
        skill_id=application.skill_id
    )
    db.add(new_mentor)
    db.commit()
    db.refresh(new_mentor)
    return new_mentor

@router.post("/mapreject", response_model=schemas.MentorApplicationResponse)
def mentor_rejection(
    m_data: schemas.MentorRejection,
    db: Session = Depends(get_db),
    ph: models.PracticeHead = Depends(require_practiceHead)
):
    application = db.query(models.MentorApplication).options(
        joinedload(models.MentorApplication.employee),
        joinedload(models.MentorApplication.skill)
    ).filter(models.MentorApplication.ma_id == m_data.ma_id).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.status != "Pending":
        raise HTTPException(status_code=400, detail=f"Application is already {application.status}")

    
    ph_skill_ids = [
        row.skill_id for row in db.query(models.PracticeHead).filter(
            models.PracticeHead.emp_id == ph.emp_id
        ).all()
    ]

    if application.skill_id not in ph_skill_ids:
        raise HTTPException(status_code=403, detail="You can only reject for your own skill")

    application.status = "Rejected"
    application.approved_at = datetime.now().date()
    application.approved_by = ph.employee.name
    db.commit()
    db.refresh(application)
    return application