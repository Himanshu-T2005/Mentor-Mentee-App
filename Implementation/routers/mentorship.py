from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import require_mentor, get_current_user

router = APIRouter(prefix="/mentor", tags=["Mentor"])


def build_request_response(req: models.MentorshipRequest) -> schemas.MentorShipRequestResponse:
    return schemas.MentorShipRequestResponse(
        mr_id=req.mr_id,
        mentor_id=req.mentor_id,
        mentee_id=req.mentee_id,
        skill_id=req.skill_id,
        status=req.status,
        mentor_name=req.mentor.name if req.mentor else None,
        mentee_name=req.mentee.name if req.mentee else None,
        skill_name=req.skill.skill_name if req.skill else None,
    )


def build_mentorship_response(ms: models.Mentorship) -> schemas.MenteeResponse:
    return schemas.MenteeResponse(
        ms_id=ms.ms_id,
        mentor_id=ms.mentor_id,
        mentee_id=ms.mentee_id,
        skill_id=ms.skill_id,
        mentor_name=ms.mentor.name if ms.mentor else None,
        mentee_name=ms.mentee.name if ms.mentee else None,
        skill_name=ms.skill.skill_name if ms.skill else None,
    )


@router.post("/request", response_model=schemas.MentorShipRequestResponse, status_code=201)
def request_mentorship(
    mentor_data: schemas.MentorShipRequest,
    db: Session = Depends(get_db),
    mentee: models.Employee = Depends(get_current_user)
):
    mentor_record = db.query(models.Mentors).filter(
        models.Mentors.emp_id == mentor_data.mentor_id,
        models.Mentors.skill_id == mentor_data.skill_id
    ).first()
    if not mentor_record:
        raise HTTPException(status_code=404, detail="Mentor not found for this skill")

    existing = db.query(models.MentorshipRequest).filter(
        models.MentorshipRequest.mentor_id == mentor_data.mentor_id,
        models.MentorshipRequest.mentee_id == mentee.emp_id,
        models.MentorshipRequest.skill_id == mentor_data.skill_id
    ).first()
    if existing:
        if existing.status == "Pending":
            raise HTTPException(status_code=400, detail="You already have a pending request with this mentor")
        elif existing.status == "Accepted":
            raise HTTPException(status_code=400, detail="You are already under his mentorship for this skill")

    new_req = models.MentorshipRequest(
        mentor_id=mentor_data.mentor_id,
        mentee_id=mentee.emp_id,
        skill_id=mentor_data.skill_id,
        status="Pending"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return build_request_response(new_req)


@router.get("/getreqs", response_model=list[schemas.MentorShipRequestResponse])
def get_all_mreq(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    if current_user.role_type == "Admin":
        reqs = db.query(models.MentorshipRequest).all()
        return [build_request_response(r) for r in reqs]

    mentor_record = db.query(models.Mentors).filter(
        models.Mentors.emp_id == current_user.emp_id
    ).first()

    if mentor_record:
        reqs = db.query(models.MentorshipRequest).filter(
            models.MentorshipRequest.mentor_id == current_user.emp_id
        ).all()
        return [build_request_response(r) for r in reqs]
    
    reqs = db.query(models.MentorshipRequest).filter(
        models.MentorshipRequest.mentee_id == current_user.emp_id
    ).all()
    return [build_request_response(r) for r in reqs]


@router.post("/accept", response_model=schemas.MentorShipAcceptResponse)
def mentor_accept(
    msa_data: schemas.MentorShipAccept,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    request = db.query(models.MentorshipRequest).filter(
        models.MentorshipRequest.mr_id == msa_data.mr_id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request.status == "Accepted":
        raise HTTPException(status_code=400, detail="Already accepted")
    if request.mentor_id != mentor.emp_id:
        raise HTTPException(status_code=403, detail="You can only accept your own requests")

    request.status = "Accepted"
    new_mentorship = models.Mentorship(
        mentor_id=request.mentor_id,
        mentee_id=request.mentee_id,
        skill_id=request.skill_id
    )
    db.add(new_mentorship)
    db.commit()
    db.refresh(new_mentorship)
    return new_mentorship


@router.post("/reject", response_model=schemas.MentorShipRequestResponse)
def mentor_reject(
    msr_data: schemas.MentorShipReject,
    db: Session = Depends(get_db),
    mentor: models.Employee = Depends(require_mentor)
):
    request = db.query(models.MentorshipRequest).filter(
        models.MentorshipRequest.mr_id == msr_data.mr_id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request.status != "Pending":
        raise HTTPException(status_code=400, detail=f"Request is already {request.status}")
    if request.mentor_id != mentor.emp_id:
        raise HTTPException(status_code=403, detail="You can only reject your own requests")

    request.status = "Rejected"
    db.commit()
    db.refresh(request)
    return build_request_response(request)


@router.get("/skills/{s_id}", response_model=list[schemas.SkillReqResponse])
def get_ment_by_skill(
    s_id: int,
    user: models.Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill_ments = db.query(models.Mentors).filter(models.Mentors.skill_id == s_id).all()
    return [{"skill": m.skill, "mentor": m.mentor} for m in skill_ments]


@router.get("/getmentee", response_model=list[schemas.MenteeResponse])
def get_all_mentee(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    if current_user.role_type == "Admin":
        mentorships = db.query(models.Mentorship).all()
        return [build_mentorship_response(m) for m in mentorships]

    mentor_record = db.query(models.Mentors).filter(
        models.Mentors.emp_id == current_user.emp_id
    ).first()

    if mentor_record:
        mentorships = db.query(models.Mentorship).filter(
            models.Mentorship.mentor_id == current_user.emp_id
        ).all()
        return [build_mentorship_response(m) for m in mentorships]

    raise HTTPException(status_code=403, detail="You do not have permission to view mentees.")


@router.get("/mymentorship", response_model=list[schemas.MenteeResponse])
def get_my_mentorship(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    mentorships = db.query(models.Mentorship).filter(
        models.Mentorship.mentee_id == current_user.emp_id
    ).all()
    return [build_mentorship_response(m) for m in mentorships]

@router.get("/ph/myskills", response_model=list[schemas.SkillResponse])
def get_ph_skills(
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_user)
):
    ph_entries = db.query(models.PracticeHead).filter(
        models.PracticeHead.emp_id == current_user.emp_id
    ).all()
    return [entry.skill for entry in ph_entries]
