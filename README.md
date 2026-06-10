# Mentor-Mentee Management System 

A full-stack web application designed to streamline mentorship programs within organizations and educational institutions. The platform enables mentors and mentees to connect, manage mentorship requests, track goals, and collaborate through a secure role-based system.

---

## Features

### Authentication & Authorization

* Secure JWT-based Authentication
* Role-Based Access Control (RBAC)
* Multiple User Roles:

  * Admin
  * Mentor
  * Mentee
  * Practice Head

### Mentor Management

* Mentor Registration
* Mentor Application Approval Workflow
* Mentor Profile Management
* Skill-Based Mentor Categorization

### Mentee Management

* Mentee Registration and Onboarding
* Mentor Search and Selection
* Mentorship Request Management

### Goal Tracking

* Create and Manage Goals
* Monitor Progress
* Track Mentorship Outcomes

### Employee Management

* Employee Onboarding
* User Profile Management
* Centralized User Database

### Dashboard

* User-Specific Dashboards
* Mentorship Activity Overview
* Profile and Status Management

##  Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* React Router
* Axios
* Vite

### Backend

* FastAPI
* Python

### Database

* PostgreSQL
* SQLAlchemy ORM

### Authentication & Security

* JWT Authentication
* Passlib Password Hashing

### Development Tools

* Git
* GitHub

---

##  System Architecture

Frontend (React + TypeScript)
            │
            ▼
       REST APIs
            │
            ▼
Backend (FastAPI + Python)
            │
            ▼
 PostgreSQL Database

##  Project Structure

Mentor-Mentee-App/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── database/
│   └── main.py
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Himanshu-T2005/Mentor-Mentee-App.git

cd Mentor-Mentee-App
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Configure PostgreSQL database credentials and environment variables.

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📖 API Documentation

FastAPI automatically generates API documentation.

### Swagger UI

```text
http://localhost:8000/docs
```

### ReDoc

```text
http://localhost:8000/redoc
```

---

## 📸 Screenshots

Add screenshots of your application here.

### Login Page

![Login Page](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Mentor Management

![Mentor Management](screenshots/mentor-management.png)

### Goal Tracking

![Goal Tracking](screenshots/goal-tracking.png)

---

## 🎯 Key Functionalities

* User Authentication & Authorization
* Role-Based Access Control
* Mentor Approval Workflow
* Skill Management
* Employee Management
* Goal Tracking System
* Mentorship Request Handling
* Responsive Dashboard
* REST API Integration
* Secure Database Operations

---

## 🚀 Future Enhancements

* Real-Time Chat System
* Video Meeting Integration
* Email Notifications
* AI-Based Mentor Recommendation Engine
* Analytics Dashboard
* Docker Support
* Cloud Deployment (AWS/Azure/GCP)

---

## 💼 Resume Highlights

* Developed a full-stack mentorship management platform using React, TypeScript, FastAPI, and PostgreSQL.
* Implemented secure JWT-based authentication and role-based access control for multiple user roles.
* Designed and developed RESTful APIs for mentorship workflows, mentor approvals, employee management, and goal tracking.
* Integrated PostgreSQL using SQLAlchemy ORM for efficient and scalable database management.
* Built responsive and user-friendly interfaces with React, TypeScript, and Tailwind CSS.
