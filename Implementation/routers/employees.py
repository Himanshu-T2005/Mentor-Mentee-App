from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import hash_password, require_admin, get_current_user

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/", response_model=schemas.EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee_data: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    admin: models.Employee = Depends(require_admin)
):
    existing = db.query(models.Employee).filter(
        models.Employee.email_id == employee_data.email_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="An employee with this email already exists")

    new_employee = models.Employee(
        name=employee_data.name,
        email_id=employee_data.email_id,
        hashed_password=hash_password(employee_data.password),
        phone_number=employee_data.phone_number,
        division=employee_data.division,
        date_of_joining=employee_data.date_of_joining,
        role_type=employee_data.role_type,
        years_of_exp=employee_data.years_of_exp,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


@router.get("/me", response_model=schemas.EmployeeResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    return current_user


@router.get("/", response_model=list[schemas.EmployeeResponse], summary="Get all employees")
def get_all_employees(
    db: Session = Depends(get_db),
    admin: models.Employee = Depends(require_admin)
):
    return db.query(models.Employee).all()



@router.get("/mentors", response_model=list[schemas.EmployeeResponse], summary="Get all approved mentors")
def get_all_mentors(
    db: Session = Depends(get_db),
    admin: models.Employee = Depends(require_admin)
):
    mentor_ids = [m.emp_id for m in db.query(models.Mentors).all()]
    return db.query(models.Employee).filter(models.Employee.emp_id.in_(mentor_ids)).all()



@router.get("/mentees", response_model=list[schemas.MenteeResponse], summary="Get all active mentees")
def get_all_mentees(
    db: Session = Depends(get_db),
    admin: models.Employee = Depends(require_admin)
):
    return db.query(models.Mentorship).all()