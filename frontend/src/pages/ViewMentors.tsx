import { useEffect, useState } from "react"
import { getAllMentors } from "../services/employeeService"

export default function ViewMentors() {
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllMentors().then(setMentors).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Mentors</h1>
        <p className="page-sub">{mentors.length} approved mentor(s)</p>
      </div>
      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         mentors.length === 0 ? <div className="empty">No approved mentors yet.</div> : (
          <table>
            <thead><tr><th>Name</th><th>Division</th><th>Experience</th></tr></thead>
            <tbody>
              {mentors.map(m => (
                <tr key={m.emp_id}>
                  <td>
                    <div className="name-cell">
                      <div style={{ fontWeight: 500 }}>{m.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text3)" }}>{m.email_id}</div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{m.division || "—"}</span></td>
                  <td>{m.years_of_exp} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}