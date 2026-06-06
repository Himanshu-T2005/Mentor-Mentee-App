import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { createGoal, getGoals, addCheckpoint, toggleCheckpoint, deleteCheckpoint } from "../services/goalService"
import { getMyMentees } from "../services/mentorService"

export default function UpdateGoal() {
  const [searchParams] = useSearchParams()
  const [mentees, setMentees] = useState<any[]>([])
  const [msId, setMsId] = useState(searchParams.get("ms_id") || "")
  const [tab, setTab] = useState<"create" | "checkpoints">("create")

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [deadline, setDeadline] = useState("")
  const [creating, setCreating] = useState(false)

  const [goals, setGoals] = useState<any[]>([])
  const [selectedGoalId, setSelectedGoalId] = useState("")
  const [newCheckpointText, setNewCheckpointText] = useState("")
  const [addingCp, setAddingCp] = useState(false)

  useEffect(() => {
    getMyMentees().then(setMentees).catch(console.error)
  }, [])

  useEffect(() => {
    if (msId && tab === "checkpoints") {
      loadGoals()
    }
  }, [msId, tab])

  const loadGoals = async () => {
    try {
      const data = await getGoals(Number(msId))
      setGoals(data)
      if (data.length > 0 && !selectedGoalId) {
        setSelectedGoalId(String(data[0].g_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msId) { alert("Please select a mentee first"); return }
    setCreating(true)
    try {
      await createGoal(Number(msId), { title, desc, deadline })
      alert("Goal created!")
      setTitle(""); setDesc(""); setDeadline("")
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error creating goal")
    } finally { setCreating(false) }
  }

  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoalId || !newCheckpointText.trim()) return
    setAddingCp(true)
    try {
      await addCheckpoint(Number(selectedGoalId), newCheckpointText.trim())
      setNewCheckpointText("")
      await loadGoals()
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error adding checkpoint")
    } finally { setAddingCp(false) }
  }

  const handleToggle = async (g_id: number, cp_id: number, current: boolean) => {
    try {
      await toggleCheckpoint(g_id, cp_id, !current)
      await loadGoals()
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error updating checkpoint")
    }
  }

  const handleDeleteCp = async (g_id: number, cp_id: number) => {
    if (!confirm("Delete this checkpoint?")) return
    try {
      await deleteCheckpoint(g_id, cp_id)
      await loadGoals()
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error deleting checkpoint")
    }
  }

  const currentGoal = goals.find(g => String(g.g_id) === selectedGoalId)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Goal Management</h1>
        <p className="page-sub">Set goals and track progress through checkpoints</p>
      </div>

      <div className="form-card" style={{ maxWidth: "580px" }}>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button onClick={() => setTab("create")} className={`btn ${tab === "create" ? "btn-primary" : "btn-secondary"}`}>
            Create Goal
          </button>
          <button onClick={() => setTab("checkpoints")} className={`btn ${tab === "checkpoints" ? "btn-primary" : "btn-secondary"}`}>
            Checkpoints
          </button>
        </div>

        <div className="form-group">
          <label>Select Mentee</label>
          <select value={msId} onChange={e => { setMsId(e.target.value); setSelectedGoalId("") }}>
            <option value="">— Select a mentee —</option>
            {mentees.map(m => (
              <option key={m.ms_id} value={m.ms_id}>
                {m.mentee_name ?? `Mentee #${m.mentee_id}`} — {m.skill_name ?? `Skill #${m.skill_id}`}
              </option>
            ))}
          </select>
        </div>

        {tab === "create" && (
          <form onSubmit={handleCreateGoal}>
            <div className="form-group">
              <label>Goal Title</label>
              <input placeholder="e.g. Learn Python basics" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="What should the mentee achieve?" value={desc} onChange={e => setDesc(e.target.value)} rows={3} required style={{ resize: "vertical" }} />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={creating}>
              {creating ? "Creating..." : "Create Goal"}
            </button>
          </form>
        )}

        {tab === "checkpoints" && (
          <div>
            {!msId ? (
              <p style={{ color: "var(--text3)", fontSize: "14px" }}>Select a mentee above to manage their checkpoints.</p>
            ) : goals.length === 0 ? (
              <p style={{ color: "var(--text3)", fontSize: "14px" }}>No goals yet. Create a goal first.</p>
            ) : (
              <>
                <div className="form-group">
                  <label>Select Goal</label>
                  <select value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)}>
                    {goals.map(g => (
                      <option key={g.g_id} value={g.g_id}>
                        {g.title} — {g.percent}% done
                      </option>
                    ))}
                  </select>
                </div>

                {currentGoal && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text2)" }}>Progress</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--teal-400)" }}>{currentGoal.percent}%</span>
                      </div>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${currentGoal.percent}%` }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      {currentGoal.checkpoints.length === 0 ? (
                        <p style={{ color: "var(--text3)", fontSize: "13px" }}>No checkpoints yet. Add one below.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {currentGoal.checkpoints.map((cp: any) => (
                            <div key={cp.cp_id} style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "10px 12px", background: "var(--surface2)",
                              borderRadius: "var(--radius-sm)", border: "1px solid var(--border)"
                            }}>
                              <input
                                type="checkbox"
                                checked={cp.is_done}
                                onChange={() => handleToggle(currentGoal.g_id, cp.cp_id, cp.is_done)}
                                style={{ width: "16px", height: "16px", accentColor: "var(--teal-400)", cursor: "pointer", flexShrink: 0 }}
                              />
                              <span style={{
                                flex: 1, fontSize: "14px",
                                color: cp.is_done ? "var(--text3)" : "var(--text)",
                                textDecoration: cp.is_done ? "line-through" : "none"
                              }}>
                                {cp.text}
                              </span>
                              <button
                                onClick={() => handleDeleteCp(currentGoal.g_id, cp.cp_id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: "16px", padding: "0 4px", lineHeight: 1 }}
                                title="Delete checkpoint"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleAddCheckpoint} style={{ display: "flex", gap: "8px" }}>
                      <input
                        placeholder="Add a checkpoint..."
                        value={newCheckpointText}
                        onChange={e => setNewCheckpointText(e.target.value)}
                        required
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="btn btn-primary" disabled={addingCp}>
                        {addingCp ? "..." : "Add"}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
