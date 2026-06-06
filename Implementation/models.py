from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Employee(Base):
    __tablename__ = "employees"

    emp_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email_id = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    division = Column(String(100))
    date_of_joining = Column(Date)
    role_type = Column(String(50))
    years_of_exp = Column(Integer)

class Skills(Base):
    __tablename__ = "skills"

    skill_id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), nullable=False, unique=True)

class MentorApplication(Base):
    __tablename__ = "mentor_application"

    ma_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"))
    skill_id = Column(Integer, ForeignKey("skills.skill_id"))
    status = Column(String(50), nullable=False)
    submitted_at = Column(Date)
    approved_by = Column(String(100))
    approved_at = Column(Date)

    employee = relationship("Employee")
    skill = relationship("Skills")

class Mentors(Base):
    __tablename__ = "mentors"

    m_id = Column(Integer, primary_key=True, index=True)
    ma_id = Column(Integer, ForeignKey("mentor_application.ma_id"))
    emp_id = Column(Integer, ForeignKey("employees.emp_id"))
    skill_id = Column(Integer, ForeignKey("skills.skill_id"))

    mentor = relationship("Employee")
    skill = relationship("Skills")

class Mentee(Base):
    __tablename__ = "mentee"

    mentee_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), unique=True)

    employee = relationship("Employee")

class PracticeHead(Base):
    __tablename__ = "practice_head"

    ph_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"))
    skill_id = Column(Integer, ForeignKey("skills.skill_id"))

    employee = relationship("Employee")
    skill = relationship("Skills")

class MentorshipRequest(Base):
    __tablename__ = "mentorship_request"

    mr_id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("employees.emp_id"))
    mentee_id = Column(Integer, ForeignKey("employees.emp_id"))
    skill_id = Column(Integer, ForeignKey("skills.skill_id"))
    status = Column(String(50), nullable=False, default="Pending")

    mentor = relationship("Employee", foreign_keys=[mentor_id])
    mentee = relationship("Employee", foreign_keys=[mentee_id])
    skill = relationship("Skills", foreign_keys=[skill_id])

class Mentorship(Base):
    __tablename__ = "mentorship"

    ms_id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("employees.emp_id"))
    mentee_id = Column(Integer, ForeignKey("employees.emp_id"))
    skill_id = Column(Integer, ForeignKey("skills.skill_id"))

    mentor = relationship("Employee", foreign_keys=[mentor_id])
    mentee = relationship("Employee", foreign_keys=[mentee_id])
    skill = relationship("Skills", foreign_keys=[skill_id])

class Goal(Base):
    __tablename__ = "goal"

    g_id = Column(Integer, primary_key=True, index=True)
    ms_id = Column(Integer, ForeignKey("mentorship.ms_id"))
    title = Column(String(100))
    desc = Column(String(1000))
    deadline = Column(Date)
    percent = Column(Float, default=0.0)

    checkpoints = relationship("Checkpoint", back_populates="goal", cascade="all, delete-orphan")

class Checkpoint(Base):
    __tablename__ = "checkpoint"

    cp_id = Column(Integer, primary_key=True, index=True)
    g_id = Column(Integer, ForeignKey("goal.g_id"))
    text = Column(String(500), nullable=False)
    is_done = Column(Boolean, default=False)

    goal = relationship("Goal", back_populates="checkpoints")
