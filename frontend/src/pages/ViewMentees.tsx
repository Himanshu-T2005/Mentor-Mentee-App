import { useEffect, useState } from "react"
import { getAllMentees, getAllEmployees } from "../services/employeeService"
import { getSkills } from "../services/skillService"

export default function ViewMentees() {
  const [mentees, setMentees] = useState<any[]>([])
  const [empMap, setEmpMap] = useState<Map<number, any>>(new Map())
  const [skillMap, setSkillMap] = useState<Map<number, string>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllMentees(), getAllEmployees(), getSkills()]).then(([m, e, s]) => {
      setMentees(m)
      setEmpMap(new Map(e.map((x: any) => [x.emp_id, x])))
      setSkillMap(new Map(s.map((x: any) => [x.skill_id, x.skill_name])))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Active Mentees</h1>
        <p className="page-sub">{mentees.length} active mentorship(s)</p>
      </div>
      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         mentees.length === 0 ? <div className="empty">No active mentees yet.</div> : (
          <table>
            <thead><tr><th>Mentee</th><th>Mentor</th><th>Skill</th><th>Division</th></tr></thead>
            <tbody>
              {mentees.map(m => {
                const mentee = empMap.get(m.mentee_id)
                const mentor = empMap.get(m.mentor_id)
                return (
                  <tr key={m.ms_id}>
                    <td>
                      <div className="name-cell">
                        <div style={{ fontWeight: 500 }}>{mentee?.name ?? `#${m.mentee_id}`}</div>
                        <div style={{ fontSize: "12px", color: "var(--text3)" }}>{mentee?.email_id}</div>                        
                      </div>
                    </td>
                    <td>
                      <div className="name-cell">
                        {mentor?.name ?? `#${m.mentor_id}`}
                      </div>
                    </td>
                    <td><span className="badge badge-green">{skillMap.get(m.skill_id) ?? `#${m.skill_id}`}</span></td>
                    <td style={{ color: "var(--text2)" }}>{mentee?.division || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}