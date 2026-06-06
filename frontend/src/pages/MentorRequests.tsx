import { useEffect, useState } from "react"
import { getMentorshipRequests, acceptMenteeRequest, rejectMenteeRequest } from "../services/mentorService"

export default function MentorRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const userRole = localStorage.getItem("role")?.toLowerCase() || "mentee"
  const isMentor = userRole === "mentor"

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setRequests(await getMentorshipRequests()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const accept = async (mr_id: number) => {
    try { await acceptMenteeRequest(mr_id); alert("Accepted!"); load() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  const reject = async (mr_id: number) => {
    try { await rejectMenteeRequest(mr_id); alert("Rejected"); load() }
    catch (e: any) { alert(e?.response?.data?.detail || "Error") }
  }

  const statusBadge = (s: string) => {
    if (s === "Accepted") return <span className="badge badge-green">Accepted</span>
    if (s === "Rejected") return <span className="badge badge-red">Rejected</span>
    return <span className="badge badge-yellow">Pending</span>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mentorship Requests</h1>
        <p className="page-sub">{requests.length} total request(s)</p>
      </div>

      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         requests.length === 0 ? <div className="empty">No requests yet.</div> : (
          <table>
            <thead>
              <tr>
                <th>{isMentor ? "Mentee" : "Mentor"}</th>
                <th>Skill</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.mr_id}>
                  <td style={{ fontWeight: 500 }}>
                    {isMentor
                      ? (r.mentee_name ?? `#${r.mentee_id}`)
                      : (r.mentor_name ?? `#${r.mentor_id}`)
                    }
                  </td>
                  <td><span className="badge badge-blue">{r.skill_name ?? `Skill #${r.skill_id}`}</span></td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    {isMentor && r.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => accept(r.mr_id)} className="btn btn-success btn-sm">Accept</button>
                        <button onClick={() => reject(r.mr_id)} className="btn btn-danger btn-sm">Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text3)" }}>—</span>
                    )}
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
