import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Navbar from "./layout/Navbar"
import Login from "./pages/Login"
import Enroll from "./pages/Enroll"
import MenteeDashboard from "./pages/MenteeDashboard"
import MentorDashboard from "./pages/MentorDashboard"
import BrowseMentors from "./pages/BrowseMentors"
import Goals from "./pages/Goals"
import AdminDashboard from "./pages/AdminDashboard"
import ViewPracticeHeads from "./pages/ViewPracticeHeads"
import ViewMentors from "./pages/ViewMentors"
import ViewMentees from "./pages/ViewMentees"
import ViewMentorsBySkill from "./pages/ViewMentorsBySkill"
import MentorRequests from "./pages/MentorRequests"
import AddEmployee from "./pages/AddEmployee"
import AddPracticeHead from "./pages/AddPracticeHead"
import CreateSkill from "./pages/CreateSkill"
import ApproveMentors from "./pages/ApproveMentors"
import UpdateGoal from "./pages/UpdateGoal"
import ProtectedRoute from "./components/ProtectedRoute"

const AUTH_ROUTES = ["/", "/enroll"]

function Layout() {
  const location = useLocation()
  const hideNavbar = AUTH_ROUTES.includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/enroll" element={<Enroll />} />

        <Route path="/admin-dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/add-employee" element={<ProtectedRoute roles={["admin"]}><AddEmployee /></ProtectedRoute>} />
        <Route path="/add-practice-head" element={<ProtectedRoute roles={["admin"]}><AddPracticeHead /></ProtectedRoute>} />
        <Route path="/create-skill" element={<ProtectedRoute roles={["admin"]}><CreateSkill /></ProtectedRoute>} />
        <Route path="/view-practice-heads" element={<ProtectedRoute roles={["admin"]}><ViewPracticeHeads /></ProtectedRoute>} />
        <Route path="/view-mentors" element={<ProtectedRoute roles={["admin"]}><ViewMentors /></ProtectedRoute>} />
        <Route path="/view-mentees" element={<ProtectedRoute roles={["admin"]}><ViewMentees /></ProtectedRoute>} />

        <Route path="/approve-mentors" element={<ProtectedRoute roles={["practicehead"]}><ApproveMentors /></ProtectedRoute>} />
        <Route path="/mentors-by-skill" element={<ProtectedRoute roles={["practicehead"]}><ViewMentorsBySkill /></ProtectedRoute>} />

        <Route path="/mentor-dashboard" element={<ProtectedRoute roles={["mentor"]}><MentorDashboard /></ProtectedRoute>} />
        <Route path="/update-goal" element={<ProtectedRoute roles={["mentor"]}><UpdateGoal /></ProtectedRoute>} />

        <Route path="/mentee-dashboard" element={<ProtectedRoute roles={["mentee"]}><MenteeDashboard /></ProtectedRoute>} />
        <Route path="/browse-mentors" element={<ProtectedRoute roles={["mentee"]}><BrowseMentors /></ProtectedRoute>} />
        <Route path="/mentor-requests" element={<ProtectedRoute roles={["mentee", "mentor"]}><MentorRequests /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute roles={["mentee"]}><Goals /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
