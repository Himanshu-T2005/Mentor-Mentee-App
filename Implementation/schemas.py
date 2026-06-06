from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List


class EmployeeCreate(BaseModel):
    name: str
    email_id: EmailStr
    password: str
    phone_number: Optional[str] = None
    division: Optional[str] = None
    date_of_joining: Optional[date] = None
    role_type: str
    years_of_exp: int

class EmployeeResponse(BaseModel):
    emp_id: int
    name: str
    email_id: str
    phone_number: Optional[str]
    division: Optional[str]
    date_of_joining: Optional[date]
    role_type: str
    years_of_exp: int
    model_config = {"from_attributes": True}

class LoginInitResponse(BaseModel):
    email: str
    requires_role_selection: bool
    roles: List[str]

class LoginCompleteRequest(BaseModel):
    email: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SkillCreate(BaseModel):
    skill_name: str

class SkillResponse(BaseModel):
    skill_id: int
    skill_name: str
    model_config = {"from_attributes": True}

class SkillReqResponse(BaseModel):
    mentor: EmployeeResponse
    skill: SkillResponse


class MentorApplication(BaseModel):
    skill_id: int

class MentorApplicationResponse(BaseModel):
    ma_id: int
    emp_id: int
    skill_id: int
    status: str
    submitted_at: Optional[date]
    approved_at: Optional[date]
    approved_by: Optional[str]
    employee: Optional[EmployeeResponse] = None
    skill: Optional[SkillResponse] = None
    model_config = {"from_attributes": True}

class MentorApproval(BaseModel):
    ma_id: int

class MentorRejection(BaseModel):
    ma_id: int

class MentorApprovalResponse(BaseModel):
    m_id: int
    ma_id: int
    emp_id: int
    skill_id: int
    model_config = {"from_attributes": True}


class MentorShipRequest(BaseModel):
    mentor_id: int
    skill_id: int

class MentorShipRequestResponse(BaseModel):
    mr_id: int
    mentor_id: int
    mentee_id: int
    skill_id: int
    status: str
    mentor_name: Optional[str] = None
    mentee_name: Optional[str] = None
    skill_name: Optional[str] = None
    model_config = {"from_attributes": True}

class MentorShipAccept(BaseModel):
    mr_id: int

class MentorShipReject(BaseModel):
    mr_id: int

class MentorShipAcceptResponse(BaseModel):
    ms_id: int
    mentor_id: int
    mentee_id: int
    skill_id: int
    model_config = {"from_attributes": True}

class MenteeResponse(BaseModel):
    ms_id: int
    mentor_id: int
    mentee_id: int
    skill_id: int
    mentor_name: Optional[str] = None
    mentee_name: Optional[str] = None
    skill_name: Optional[str] = None
    model_config = {"from_attributes": True}


class practiceHeadAddition(BaseModel):
    emp_id: int
    skill_id: int

class practiceHeadResponse(BaseModel):
    ph_id: int
    emp_id: int
    skill_id: int
    employee: EmployeeResponse
    skill: SkillResponse
    model_config = {"from_attributes": True}

class CheckpointCreate(BaseModel):
    text: str

class CheckpointResponse(BaseModel):
    cp_id: int
    g_id: int
    text: str
    is_done: bool
    model_config = {"from_attributes": True}

class CheckpointToggle(BaseModel):
    is_done: bool

class GoalCreate(BaseModel):
    title: str
    desc: str
    deadline: date

class GoalResponse(BaseModel):
    g_id: int
    ms_id: int
    title: str
    desc: str
    deadline: date
    percent: float
    checkpoints: List[CheckpointResponse] = []
    model_config = {"from_attributes": True}
