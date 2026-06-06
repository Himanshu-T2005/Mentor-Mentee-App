from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login/init", response_model=schemas.LoginInitResponse)
def login_init(
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.email_id == credentials.username
    ).first()

    if not employee or not verify_password(credentials.password, employee.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if employee.role_type == "Admin":
        return {
            "email": employee.email_id,
            "requires_role_selection": False,
            "roles": ["Admin"]
        }

    if db.query(models.PracticeHead).filter(
        models.PracticeHead.emp_id == employee.emp_id
    ).first():
        return {
            "email": employee.email_id,
            "requires_role_selection": False,
            "roles": ["PracticeHead"]
        }

    is_mentor = db.query(models.Mentors).filter(
        models.Mentors.emp_id == employee.emp_id
    ).first()

    is_mentee = db.query(models.Mentee).filter(
        models.Mentee.emp_id == employee.emp_id
    ).first()

    if is_mentor and is_mentee:
        return {
            "email": employee.email_id,
            "requires_role_selection": True,
            "roles": ["Mentor", "Mentee"]
        }

    if is_mentor:
        return {
            "email": employee.email_id,
            "requires_role_selection": False,
            "roles": ["Mentor"]
        }

    if is_mentee:
        return {
            "email": employee.email_id,
            "requires_role_selection": False,
            "roles": ["Mentee"]
        }

    raise HTTPException(
        status_code=403,
        detail="User has no valid role"
    )

@router.post("/login/complete", response_model=schemas.TokenResponse)
def login_complete(
    data: schemas.LoginCompleteRequest,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(
        models.Employee.email_id == data.email
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_access_token(
        data={"sub": employee.email_id, "role": data.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/enroll")
def enroll_auth(
    role : bool,
    skill_id : int,
    credentials: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db),
    ):
    employee = db.query(models.Employee).filter(
        models.Employee.email_id == credentials.username
    ).first()


    if not employee or not verify_password(credentials.password, employee.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if employee.years_of_exp < 8 and role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Need 7+ Years of experience"
        )

    if role:
        existing = db.query(models.MentorApplication).filter(
            models.MentorApplication.emp_id == employee.emp_id,
            models.MentorApplication.skill_id == skill_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application already exists"
            )
        new_mentor_app = models.MentorApplication(
            emp_id = employee.emp_id,
            status = "Pending",
            skill_id = skill_id,
            submitted_at = datetime.now().date(),
            approved_by = None,
            approved_at = None
        )

        db.add(new_mentor_app)
        db.commit()
        db.refresh(new_mentor_app)

        return {"message": "Mentor application submitted successfully"}
    else :
        existing = db.query(models.Mentee).filter(
            models.Mentee.emp_id == employee.emp_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mentee already enrolled"
            )
        new_mentee = models.Mentee(
            emp_id = employee.emp_id
        )

        db.add(new_mentee)
        db.commit()
        db.refresh(new_mentee)

        return {"message": "Mentee enrolled successfully"}


