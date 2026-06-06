import { useEffect, useState } from "react"
import { getAllPracticeHeads } from "../services/practiceHeadService"

export default function ViewPracticeHeads() {
  const [phs, setPhs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPracticeHeads().then(setPhs).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Practice Heads</h1>
        <p className="page-sub">{phs.length} assigned</p>
      </div>
      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         phs.length === 0 ? <div className="empty">No practice heads assigned yet.</div> : (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Skill</th></tr></thead>
            <tbody>
              {phs.map(ph => (
                <tr key={ph.ph_id}>
                  <td>
                    <div className="name-cell">
                      {ph.employee?.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{ph.employee?.email_id}</td>
                  <td><span className="badge badge-green">{ph.skill?.skill_name}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}