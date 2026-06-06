
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.post("/", response_model=schemas.SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skills(
    skill_data: schemas.SkillCreate,
    db: Session = Depends(get_db),
    user: models.Employee = Depends(get_current_user)
):

    
    existing = db.query(models.Skills).filter(
        models.Skills.skill_name == skill_data.skill_name
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill already exists"
        )

    
    new_skill = models.Skills(
        skill_name=skill_data.skill_name
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill


@router.get(
    "/",
    response_model=list[schemas.SkillResponse],
    summary="Get All Available Skills"
)
def get_all_skill(
    db: Session = Depends(get_db)
):
    skills = db.query(models.Skills).all()
    return skills

