from database import SessionLocal, engine, Base
from models import Employee
from auth import hash_password
from datetime import date

Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(Employee).filter(Employee.email_id == "admin1@ind.tech").first()
if existing:
    print("Admin already exists. Skipping.")
else:
    admin = Employee(
        name="Aswath",
        email_id="admin1@ind.tech",
        hashed_password=hash_password("admin123"),  
        phone_number="1234567890",
        division="Administration",
        date_of_joining=date(2015, 1, 15),
        role_type="Admin",
        years_of_exp = 11

    
    )
    db.add(admin)
    db.commit()

db.close()