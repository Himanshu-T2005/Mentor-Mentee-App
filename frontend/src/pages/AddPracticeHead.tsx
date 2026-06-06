import { useState, useEffect } from "react"
import { addPracticeHead } from "../services/practiceHeadService"
import { getAllEmployees } from "../services/employeeService"
import { getSkills } from "../services/skillService"

export default function AddPracticeHead() {
  const [empId, setEmpId] = useState("")
  const [skillId, setSkillId] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getAllEmployees(), getSkills()]).then(([e, s]) => {
      setEmployees(e); setSkills(s)
    }).catch(console.error)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await addPracticeHead({ emp_id: Number(empId), skill_id: Number(skillId) })
      alert("Practice Head added!")
      setEmpId(""); setSkillId("")
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error adding Practice Head")
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Add Practice Head</h1>
        <p className="page-sub">Assign an employee as practice head for a skill</p>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee</label>
            <select value={empId} onChange={e => setEmpId(e.target.value)} required>
              <option value="">— Select Employee —</option>
              {employees.map(emp => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.name} — {emp.role_type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Skill</label>
            <select value={skillId} onChange={e => setSkillId(e.target.value)} required>
              <option value="">— Select Skill —</option>
              {skills.map(s => (
                <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Add Practice Head
          </button>
        </form>
      </div>
    </div>
  )
}