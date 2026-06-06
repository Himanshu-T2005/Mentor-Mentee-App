import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { auth } = useAuth()

  if (!auth.token) {
    return <Navigate to="/" />
  }

  if (roles && auth.role && !roles.includes(auth.role)) {
    if (auth.role === "admin") return <Navigate to="/admin-dashboard" />
    if (auth.role === "practicehead") return <Navigate to="/approve-mentors" />
    if (auth.role === "mentor") return <Navigate to="/mentor-dashboard" />
    return <Navigate to="/mentee-dashboard" />
  }

  return <>{children}</>
}
