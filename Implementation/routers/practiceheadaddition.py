from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import require_admin

router = APIRouter(prefix="/ph", tags=["Practice Head"])


@router.post("/add", response_model=schemas.practiceHeadResponse, status_code=status.HTTP_201_CREATED, summary = "Add Practice Heads")
def practice_head_addition(
    prachead_data : schemas.practiceHeadAddition,
    db: Session = Depends(get_db),
    admin: models.Employee = Depends(require_admin)
):
    existingemp = db.query(models.Employee).filter(
        models.Employee.emp_id == prachead_data.emp_id
    ).first()

    if not existingemp:
        raise HTTPException(
            status_code=404,
            detail="Employee doesn't exists"
        )
    
    existingskill = db.query(models.Skills).filter(
        models.Skills.skill_id == prachead_data.skill_id
    ).first()

    if not existingskill:
        raise HTTPException(
            status_code=404,
            detail="Skill doesn't exists"
        )

    existing = db.query(models.PracticeHead).filter(
        models.PracticeHead.emp_id == prachead_data.emp_id,
        models.PracticeHead.skill_id == prachead_data.skill_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Practice Head already exists"
        )

    new_ph = models.PracticeHead(                
        emp_id = prachead_data.emp_id,
        skill_id = prachead_data.skill_id
    )

    db.add(new_ph)
    db.commit()
    db.refresh(new_ph)

    return new_ph

@router.get("/",response_model=list[schemas.practiceHeadResponse],summary= "Get All Practice Heads")
def get_phs(
    db:Session = Depends(get_db),
    admin : models.Employee = Depends(require_admin)
):
    return db.query(models.PracticeHead).all()   
