import { useEffect, useState } from "react"
import { getMyMentorships } from "../services/mentorService"
import { getGoals } from "../services/goalService"

export default function Goals() {
  const [mentorships, setMentorships] = useState<any[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyMentorships()
      .then(async data => {
        setMentorships(data)
        if (data.length > 0) {
          setSelected(data[0].ms_id)
          setGoals(await getGoals(data[0].ms_id))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = async (ms_id: number) => {
    setSelected(ms_id)
    try { setGoals(await getGoals(ms_id)) } catch (e) { console.error(e) }
  }

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Goals</h1>
        <p className="page-sub">{goals.length} goal(s) assigned</p>
      </div>

      {mentorships.length === 0 ? (
        <div className="card">
          <div className="empty">No active mentorships yet. Browse mentors to get started!</div>
        </div>
      ) : (
        <>
          {mentorships.length > 1 && (
            <div style={{ marginBottom: "20px", maxWidth: "320px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Mentorship</label>
                <select value={selected ?? ""} onChange={e => handleChange(Number(e.target.value))}>
                  {mentorships.map(ms => (
                    <option key={ms.ms_id} value={ms.ms_id}>
                      {ms.mentor_name ?? `Mentor #${ms.mentor_id}`} — {ms.skill_name ?? `Skill #${ms.skill_id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {goals.length === 0 ? (
            <div className="card">
              <div className="empty">No goals set yet. Your mentor will assign goals soon.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {goals.map(g => {
                const total = g.checkpoints?.length || 0
                const done = g.checkpoints?.filter((cp: any) => cp.is_done).length || 0

                return (
                  <div key={g.g_id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ fontWeight: 600, fontSize: "16px" }}>{g.title}</div>
                      <span className="badge badge-blue">Due {g.deadline}</span>
                    </div>

                    <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "16px", lineHeight: 1.6 }}>
                      {g.desc}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${g.percent}%` }} />
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--teal-400)", fontSize: "13px", minWidth: "36px", textAlign: "right" }}>
                        {g.percent}%
                      </span>
                    </div>

                    {total > 0 && (
                      <div>
                        <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Checkpoints ({done}/{total})
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {g.checkpoints.map((cp: any) => (
                            <div key={cp.cp_id} style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "8px 10px", background: "var(--surface2)", borderRadius: "var(--radius-sm)"
                            }}>
                              <div style={{
                                width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                                background: cp.is_done ? "var(--teal-400)" : "transparent",
                                border: `2px solid ${cp.is_done ? "var(--teal-400)" : "var(--text3)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                {cp.is_done && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <span style={{
                                fontSize: "13px",
                                color: cp.is_done ? "var(--text3)" : "var(--text)",
                                textDecoration: cp.is_done ? "line-through" : "none"
                              }}>
                                {cp.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {total === 0 && (
                      <p style={{ fontSize: "12px", color: "var(--text3)" }}>No checkpoints added yet.</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
