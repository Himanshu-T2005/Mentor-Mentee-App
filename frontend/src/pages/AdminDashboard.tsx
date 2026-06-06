import { Link } from "react-router-dom"

const cards = [
  { to: "/add-employee",       title: "Add Employee",      desc: "Create a new employee account" },
  { to: "/create-skill",       title: "Create Skill",       desc: "Add a skill to the program" },
  { to: "/add-practice-head",  title: "Add Practice Head",  desc: "Assign PH to a skill" },
  { to: "/view-practice-heads",title: "Practice Heads",     desc: "View all practice heads" },
  { to: "/view-mentors",       title: "All Mentors",        desc: "View approved mentors" },
  { to: "/view-mentees",       title: "All Mentees",        desc: "View active mentorships" },
]

export default function AdminDashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-sub">Manage your mentorship program</p>
      </div>
      <div className="dashboard-grid">
        {cards.map(c => (
          <Link key={c.to} to={c.to} className="dashboard-card">
            <div className="card-title">{c.title}</div>
            <div className="card-desc">{c.desc}</div>
            <div className="card-arrow">Go →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}