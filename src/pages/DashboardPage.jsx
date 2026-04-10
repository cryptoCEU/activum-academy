import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSection = searchParams.get('section') || 'cursos'

  const {
    userWithRole, visibleCatalog, userProgressMap,
    handleLogout, setUser,
  } = useApp()

  return (
    <Dashboard
      user={userWithRole}
      catalog={visibleCatalog}
      userProgressMap={userProgressMap}
      onEnterCourse={(courseId) => navigate(`/curso/${courseId}`)}
      onGoHome={() => navigate('/')}
      onLogout={() => { handleLogout(); navigate('/') }}
      onUserUpdate={(u) => setUser(u)}
      initialSection={initialSection}
    />
  )
}
