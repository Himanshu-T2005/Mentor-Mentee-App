import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { auth, logout } = useAuth()
  const role = auth.role
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-brand">MMA</div>

      <div className="navbar-links">
        {role === "admin" && (
          <>
            <NavLink to="/admin-dashboard" label="Dashboard" current={location.pathname} />
            <NavLink to="/add-employee" label="Add Employee" current={location.pathname} />
            <NavLink to="/create-skill" label="Skills" current={location.pathname} />
            <NavLink to="/add-practice-head" label="Practice Heads" current={location.pathname} />
            <NavLink to="/view-mentors" label="Mentors" current={location.pathname} />
            <NavLink to="/view-mentees" label="Mentees" current={location.pathname} />
          </>
        )}
        {role === "practicehead" && (
          <>
            <NavLink to="/approve-mentors" label="Applications" current={location.pathname} />
            <NavLink to="/mentors-by-skill" label="Mentors by Skill" current={location.pathname} />
          </>
        )}
        {role === "mentor" && (
          <>
            <NavLink to="/mentor-dashboard" label="Dashboard" current={location.pathname} />
            <NavLink to="/update-goal" label="Goals" current={location.pathname} />
          </>
        )}
        {role === "mentee" && (
          <>
            <NavLink to="/mentee-dashboard" label="Dashboard" current={location.pathname} />
            <NavLink to="/browse-mentors" label="Browse Mentors" current={location.pathname} />
            <NavLink to="/goals" label="My Goals" current={location.pathname} />
            <NavLink to="/mentor-requests" label="Requests" current={location.pathname} />
          </>
        )}
      </div>

      <button onClick={logout} className="btn btn-secondary btn-sm">
        Logout
      </button>
    </nav>
  )
}

function NavLink({ to, label, current }: { to: string; label: string; current: string }) {
  const active = current === to
  return (
    <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
      {label}
    </Link>
  )
}
