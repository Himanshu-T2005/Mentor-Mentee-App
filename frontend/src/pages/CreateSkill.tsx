import { useState } from "react"
import { addSkill } from "../services/skillService"

export default function CreateSkill() {
  const [skill, setSkill] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addSkill({ skill_name: skill })
      alert("Skill created!")
      setSkill("")
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error creating skill")
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Skill</h1>
        <p className="page-sub">Add a new skill to the mentorship program</p>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Skill Name</label>
            <input placeholder="e.g. Python, React, Cloud" value={skill}
              onChange={e => setSkill(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Creating..." : "Create Skill"}
          </button>
        </form>
      </div>
    </div>
  )
}