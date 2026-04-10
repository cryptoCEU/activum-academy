import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AcademyLanding from '../components/AcademyLanding'
import AuthModal from '../components/AuthModal'

export default function HomePage() {
  const navigate = useNavigate()
  const {
    userWithRole, visibleCatalog, userProgressMap,
    authModal, setAuthModal,
    handleLogout, setUser,
  } = useApp()

  const handleEnterCourse = (courseId) => {
    navigate(`/curso/${courseId}`)
  }

  return (
    <>
      <AcademyLanding
        user={userWithRole}
        catalog={visibleCatalog}
        userProgressMap={userProgressMap}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        onEnterCourse={handleEnterCourse}
        onLogout={handleLogout}
        onOpenDashboard={(section = 'cursos') => navigate(`/dashboard?section=${section}`)}
      />
      {authModal && (
        <AuthModal
          initialMode={authModal}
          onSuccess={(u) => { setUser(u); setAuthModal(null) }}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  )
}
