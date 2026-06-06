import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMyProfile } from "../services/employeeService"
import { getMyMentorships, getMentorshipRequests } from "../services/mentorService"

export default function MenteeDashboard() {
  const [user, setUser] = useState<any>(null)
  const [mentorships, setMentorships] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getMyProfile(), getMyMentorships(), getMentorshipRequests()])
      .then(([p, m, r]) => {
        setUser(p)
        setMentorships(m)
        setPending(r.filter((x: any) => x.status === "Pending"))
      }).catch(console.error)
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name || "..."}</h1>
        <p className="page-sub">Your mentorship overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active Mentorships</div>
          <div className="stat-value">{mentorships.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{pending.length}</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: "28px" }}>
        <Link to="/browse-mentors" className="dashboard-card">
          <div className="card-title">Browse Mentors</div>
          <div className="card-desc">Find a mentor by skill</div>
          <div className="card-arrow">Go →</div>
        </Link>
        {mentorships.length > 0 && (
          <Link to="/goals" className="dashboard-card">
            <div className="card-title">My Goals</div>
            <div className="card-desc">{mentorships.length} active mentorship(s)</div>
            <div className="card-arrow">View →</div>
          </Link>
        )}
        <Link to="/mentor-requests" className="dashboard-card">
          <div className="card-title">My Requests</div>
          <div className="card-desc">{pending.length} pending request(s)</div>
          <div className="card-arrow">View →</div>
        </Link>
      </div>

      {mentorships.length > 0 && (
        <>
          <h2 className="section-title">Active Mentorships</h2>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Mentor</th>
                  <th>Skill</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mentorships.map(ms => (
                  <tr key={ms.ms_id}>
                    <td style={{ fontWeight: 500 }}>{ms.mentor_name ?? `#${ms.mentor_id}`}</td>
                    <td><span className="badge badge-green">{ms.skill_name ?? `Skill #${ms.skill_id}`}</span></td>
                    <td>
                      <Link to="/goals" style={{ color: "var(--teal-400)", fontSize: "13px", textDecoration: "none" }}>
                        View Goals →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
