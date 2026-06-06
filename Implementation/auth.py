from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/init")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.Employee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    employee = db.query(models.Employee).filter(
        models.Employee.email_id == email
    ).first()
    if employee is None:
        raise credentials_exception
    return employee


def require_admin(current_user: models.Employee = Depends(get_current_user)):
    if current_user.role_type != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can do this")
    return current_user


def require_mentor_eligible(current_user: models.Employee = Depends(get_current_user)):
    if current_user.years_of_exp < 7:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="7+ years of experience required")
    return current_user


def require_mentor(
    db: Session = Depends(get_db),
    user: models.Employee = Depends(get_current_user)
) -> models.Employee:
    mentor = db.query(models.Mentors).filter(models.Mentors.emp_id == user.emp_id).first()
    if mentor is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only approved mentors can do this")
    return user


def require_practiceHead(
    db: Session = Depends(get_db),
    user: models.Employee = Depends(get_current_user)
) -> models.PracticeHead:
    ph = db.query(models.PracticeHead).options(
        joinedload(models.PracticeHead.employee),
        joinedload(models.PracticeHead.skill)
    ).filter(models.PracticeHead.emp_id == user.emp_id).first()
    if ph is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only practice heads can do this")
    return ph
