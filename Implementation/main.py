from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, employees, skills, mentorapplication, practiceheadaddition, mentorship, goal

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mentor-Mentee API", version="0.1.0")


origins = [
    f"http://localhost:{port}" for port in range(5173, 5201)
] + [
    f"http://127.0.0.1:{port}" for port in range(5173, 5201)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(skills.router)
app.include_router(mentorapplication.router)
app.include_router(practiceheadaddition.router)
app.include_router(mentorship.router)
app.include_router(goal.router)

@app.get("/")
def root():
    return {"message": "MMA - Hola"}