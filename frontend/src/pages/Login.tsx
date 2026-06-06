import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginInit, loginComplete } from "../services/authService"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [needsRoleSelect, setNeedsRoleSelect] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"Mentor" | "Mentee">("Mentee")

  const navigate = useNavigate()
  const { login } = useAuth()

  const goToDashboard = (role: string) => {
    const r = role.toLowerCase()
    if (r === "admin") navigate("/admin-dashboard")
    else if (r === "practicehead") navigate("/approve-mentors")
    else if (r === "mentor") navigate("/mentor-dashboard")
    else navigate("/mentee-dashboard")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await loginInit(email, password)

      if (!res.requires_role_selection) {
        const role = res.roles[0]
        const tokenRes = await loginComplete(email, role)
        login(tokenRes.access_token, role.toLowerCase())
        goToDashboard(role)
      } else {
        setNeedsRoleSelect(true)
      }
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleConfirm = async () => {
    setLoading(true)
    try {
      const tokenRes = await loginComplete(email, selectedRole)
      login(tokenRes.access_token, selectedRole.toLowerCase())
      goToDashboard(selectedRole)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Sign in</h1>
        <p className="auth-sub">Mentor Mentee Application</p>

        {error && <div className="error-msg">{error}</div>}

        {!needsRoleSelect ? (
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ marginBottom: "16px", color: "var(--text2)", fontSize: "14px" }}>
              You are registered as both a Mentor and a Mentee. Choose how you want to sign in today.
            </p>

            <div className="role-toggle">
              <button
                className={selectedRole === "Mentee" ? "active" : ""}
                onClick={() => setSelectedRole("Mentee")}
              >
                Mentee
              </button>
              <button
                className={selectedRole === "Mentor" ? "active" : ""}
                onClick={() => setSelectedRole("Mentor")}
              >
                Mentor
              </button>
            </div>

            <button
              className="btn btn-primary full-width"
              onClick={handleRoleConfirm}
              disabled={loading}
              style={{ marginTop: "16px" }}
            >
              {loading ? "Signing in..." : `Continue as ${selectedRole}`}
            </button>
          </div>
        )}

        <p className="auth-footer">
          Not enrolled yet? <Link to="/enroll">Enroll here</Link>
        </p>
      </div>
    </div>
  )
}
