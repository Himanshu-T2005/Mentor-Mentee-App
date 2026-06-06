import { useEffect, useState } from "react"
import { getPhSkills, getMentorsBySkill } from "../services/mentorService"

export default function ViewMentorsBySkill() {
  const [skills, setSkills] = useState<any[]>([])
  const [selected, setSelected] = useState("")
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPhSkills().then(setSkills).catch(console.error)
  }, [])

  const handleChange = async (id: string) => {
    setSelected(id)
    if (!id) { setMentors([]); return }
    setLoading(true)
    try { setMentors(await getMentorsBySkill(Number(id))) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mentors by Skill</h1>
        <p className="page-sub">View approved mentors for your skills</p>
      </div>

      <div style={{ marginBottom: "24px", maxWidth: "320px" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Skill</label>
          <select value={selected} onChange={e => handleChange(e.target.value)}>
            <option value="">— Select Skill —</option>
            {skills.map(s => <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>)}
          </select>
        </div>
      </div>

      <div className="table-card">
        {loading ? <div className="loading">Loading...</div> :
         !selected ? <div className="empty">Select a skill to view mentors.</div> :
         mentors.length === 0 ? <div className="empty">No mentors for this skill yet.</div> : (
          <table>
            <thead><tr><th>Name</th><th>Division</th><th>Experience</th></tr></thead>
            <tbody>
              {mentors.map(m => (
                <tr key={m.mentor.emp_id}>
                  <td>
                    <div className="name-cell">
                      <div style={{ fontWeight: 500 }}>{m.mentor.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text3)" }}>{m.mentor.email_id}</div>                      
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{m.mentor.division || "—"}</span></td>
                  <td>{m.mentor.years_of_exp} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
