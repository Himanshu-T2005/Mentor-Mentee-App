import { useState } from "react"
import { registerEmployee } from "../services/employeeService"

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    division: "", date: "", role: "", exp: ""
  })
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerEmployee({
        name: form.name, email_id: form.email, password: form.password,
        phone_number: form.phone, division: form.division,
        date_of_joining: form.date || null,
        role_type: form.role, years_of_exp: Number(form.exp)
      })
      alert("Employee added!")
      setForm({ name:"",email:"",password:"",phone:"",division:"",date:"",role:"",exp:"" })
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error adding employee")
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Add Employee</h1>
        <p className="page-sub">Create a new employee account</p>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label>
            <input placeholder="e.g. Priya Nair" value={form.name} onChange={set("name")} required /></div>
          <div className="form-group"><label>Email</label>
            <input type="email" placeholder="priya@company.com" value={form.email} onChange={set("email")} required /></div>
          <div className="form-group"><label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required /></div>
          <div className="form-group"><label>Phone Number</label>
            <input placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} /></div>
          <div className="form-group"><label>Division</label>
            <select value={form.division} onChange={set("division")}>
              <option value="">Select Division</option>
              <option>App Dev</option><option>Web Dev</option>
              <option>AI/ML</option><option>Cloud</option>
            </select></div>
          <div className="form-group"><label>Date of Joining</label>
            <input type="date" value={form.date} onChange={set("date")} /></div>
          <div className="form-group"><label>Role Type</label>
            <select value={form.role} onChange={set("role")} required>
              <option value="">Select Role</option>
              <option>Admin</option><option>Team Lead</option>
              <option>Senior Developer</option><option>Junior Developer</option>
              <option>Intern</option>
            </select></div>
          <div className="form-group"><label>Years of Experience</label>
            <input type="number" placeholder="0" min="0" value={form.exp} onChange={set("exp")} required /></div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  )
}