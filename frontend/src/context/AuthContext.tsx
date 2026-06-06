import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface AuthState {
  token: string | null
  role: string | null
}

interface AuthContextType {
  auth: AuthState
  login: (token: string, role: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  })

  const navigate = useNavigate()

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)
    setAuth({ token, role })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("emp_id")
    setAuth({ token: null, role: null })
    navigate("/")
  }

  useEffect(() => {
    const handleStorage = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      })
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoggedIn: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
