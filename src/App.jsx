import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import HomePage      from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import CoursePage    from './pages/CoursePage'

function ProtectedRoute({ children }) {
  const { user, authReady } = useApp()
  if (!authReady) return null
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { authReady } = useApp()
  if (!authReady) return null

  return (
    <Routes>
      <Route path="/"               element={<HomePage />} />
      <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/curso/:courseId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
