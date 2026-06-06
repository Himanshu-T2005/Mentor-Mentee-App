import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { enrollUser } from "../services/authService"
import { getSkills } from "../services/skillService"
import { useAuth } from "../context/AuthContext"

interface Skill {
  skill_id: number
  skill_name: string
}

export default function Enroll() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isMentor, setIsMentor] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    if (isMentor) {
      getSkills()
        .then(setSkills)
        .catch(() => setError("Could not load skills"))
    }
  }, [isMentor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await enrollUser(email, password, isMentor, Number(selectedSkillId))

      if (isMentor) {
        alert(res.message || "Mentor application submitted! A Practice Head will review it.")
        navigate("/")
      } else {
        login(res.access_token, "mentee")
        navigate("/mentee-dashboard")
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Enrollment failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Enroll</h1>
        <p className="auth-sub">Join the Mentor Mentee Application</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>I want to enroll as</label>
            <div className="role-toggle" style={{ marginTop: "4px" }}>
              <button
                type="button"
                className={!isMentor ? "active" : ""}
                onClick={() => setIsMentor(false)}
              >
                Mentee
              </button>
              <button
                type="button"
                className={isMentor ? "active" : ""}
                onClick={() => setIsMentor(true)}
              >
                Mentor
              </button>
            </div>
          </div>

          {isMentor && (
            <div className="form-group">
              <label>Skill you want to mentor in</label>
              <select
                value={selectedSkillId}
                onChange={e => setSelectedSkillId(e.target.value)}
                required
              >
                <option value="">Select a skill</option>
                {skills.map(s => (
                  <option key={s.skill_id} value={s.skill_id}>
                    {s.skill_name}
                  </option>
                ))}
              </select>
              <small style={{ color: "var(--text3)", marginTop: "6px", display: "block" }}>
                Requires 7+ years of experience. Your application will need Practice Head approval.
              </small>
            </div>
          )}

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Submitting..." : isMentor ? "Apply as Mentor" : "Enroll as Mentee"}
          </button>
        </form>

        <p className="auth-footer">
          Already enrolled? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
