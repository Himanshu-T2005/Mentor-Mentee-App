import { useEffect, useState } from "react"
import { getSkills } from "../services/skillService"
import { getMentorsBySkill, sendMentorshipRequest } from "../services/mentorService"

export default function BrowseMentors() {
  const [skills, setSkills] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { getSkills().then(setSkills).catch(console.error) }, [])

  const handleSkillChange = async (id: string) => {
    setSelected(id)
    if (!id) { setMentors([]); return }
    setLoading(true)
    try { setMentors(await getMentorsBySkill(Number(id))) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleRequest = async (mentorId: number, skillId: number, name: string) => {
    try {
      await sendMentorshipRequest(mentorId, skillId)
      alert(`Request sent to ${name}!`)
    } catch (e: any) { alert(e?.response?.data?.detail || "Error sending request") }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Browse Mentors</h1>
        <p className="page-sub">Find a mentor by skill</p>
      </div>

      <div style={{ marginBottom: "24px", maxWidth: "320px" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Filter by Skill</label>
          <select value={selected} onChange={e => handleSkillChange(e.target.value)}>
            <option value="">— Select Skill —</option>
            {skills.map(s => <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading mentors...</div>}

      {!loading && selected && mentors.length === 0 && (
        <div className="empty">No mentors available for this skill yet.</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {mentors.map(m => (
          <div key={m.mentor.emp_id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div className="avatar" style={{ width: "44px", height: "44px", fontSize: "14px" }}>
                {m.mentor.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px" }}>{m.mentor.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text3)" }}>{m.mentor.email_id}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span className="badge badge-green">{m.skill.skill_name}</span>
              <span style={{ fontSize: "12px", color: "var(--text2)" }}>{m.mentor.years_of_exp} yrs exp</span>
            </div>
            <button
              onClick={() => handleRequest(m.mentor.emp_id, m.skill.skill_id, m.mentor.name)}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}>
              Request Mentor
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}