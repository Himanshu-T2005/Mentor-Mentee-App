import { useEffect, useState } from "react"
import { getMentorshipRequests, acceptMenteeRequest, rejectMenteeRequest, getMyMentees } from "../services/mentorService"
import { getMyProfile } from "../services/employeeService"
import { Link } from "react-router-dom"

export default function MentorDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [mentees, setMentees] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      const [reqs, profile] = await Promise.all([getMentorshipRequests(), getMyProfile()])
      setRequests(reqs.filter((r: any) => r.status === "Pending"))
      setUser(profile)
    } catch (e) { console.error(e) }
    try { setMentees(await getMyMentees()) } catch { setMentees([]) }
  }

  const accept = async (mr_id: number) => {
    try { await acceptMenteeRequest(mr_id); alert("Accepted!"); loadAll() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  const reject = async (mr_id: number) => {
    try { await rejectMenteeRequest(mr_id); alert("Rejected"); loadAll() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name || "Mentor"}</h1>
        <p className="page-sub">{mentees.length} active mentee(s)</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: "28px" }}>
        <Link to="/update-goal" className="dashboard-card">
          <div className="card-title">Set Goals</div>
          <div className="card-desc">Create and assign goals to your mentees</div>
          <div className="card-arrow">Go →</div>
        </Link>
        <div className="card" style={{ cursor: "default" }}>
          <div className="stat-label">Active Mentees</div>
          <div className="stat-value">{mentees.length}</div>
        </div>
        <div className="card" style={{ cursor: "default" }}>
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{requests.length}</div>
        </div>
      </div>

      <h2 className="section-title">Pending Requests</h2>
      <div className="table-card" style={{ marginBottom: "28px" }}>
        {requests.length === 0 ? <div className="empty">No pending requests.</div> : (
          <table>
            <thead><tr><th>Mentee</th><th>Skill</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.mr_id}>
                  <td style={{ fontWeight: 500 }}>{r.mentee_name ?? `#${r.mentee_id}`}</td>
                  <td><span className="badge badge-green">{r.skill_name ?? `Skill #${r.skill_id}`}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => accept(r.mr_id)} className="btn btn-success btn-sm">Accept</button>
                      <button onClick={() => reject(r.mr_id)} className="btn btn-danger btn-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mentees.length > 0 && (
        <>
          <h2 className="section-title">My Mentees</h2>
          <div className="table-card">
            <table>
              <thead><tr><th>Mentee</th><th>Skill</th><th>Goals</th></tr></thead>
              <tbody>
                {mentees.map(m => (
                  <tr key={m.ms_id}>
                    <td style={{ fontWeight: 500 }}>{m.mentee_name ?? `#${m.mentee_id}`}</td>
                    <td><span className="badge badge-green">{m.skill_name ?? `Skill #${m.skill_id}`}</span></td>
                    <td>
                      <Link to={`/update-goal?ms_id=${m.ms_id}`}
                        style={{ color: "var(--teal-400)", fontSize: "13px", textDecoration: "none" }}>
                        Set Goals →
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
