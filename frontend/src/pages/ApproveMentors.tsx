import { useEffect, useState } from "react"
import { getMentorApplications, approveMentorApplication, rejectMentorApplication } from "../services/mentorService"
import { Link } from "react-router-dom"

export default function ApproveMentors() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const data = await getMentorApplications()
      setRequests(data.filter((r: any) => r.status === "Pending"))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const approve = async (id: number) => {
    try { await approveMentorApplication(id); alert("Approved!"); load() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  const reject = async (id: number) => {
    try { await rejectMentorApplication(id); alert("Rejected"); load() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Mentor Applications</h1>
          <p className="page-sub">{requests.length} pending</p>
        </div>
        <Link to="/mentors-by-skill" className="btn btn-secondary">View Mentors by Skill</Link>
      </div>

      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         requests.length === 0 ? <div className="empty">No pending applications.</div> : (
          <table>
            <thead><tr><th>Employee</th><th>Skill</th><th>Applied On</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.ma_id}>
                  <td>
                    <div className="name-cell">
                      <div className="avatar">
                        {r.employee?.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2) || "?"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{r.employee?.name ?? r.emp_id}</div>
                        <div style={{ fontSize: "12px", color: "var(--text3)" }}>{r.employee?.email_id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-green">{r.skill?.skill_name ?? r.skill_id}</span></td>
                  <td style={{ color: "var(--text2)" }}>{r.submitted_at}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => approve(r.ma_id)} className="btn btn-success btn-sm">Approve</button>
                      <button onClick={() => reject(r.ma_id)} className="btn btn-danger btn-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}