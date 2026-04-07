import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabase'
import { logout, loadProgress, saveProgress, loadUserRole } from './auth'
import { courseData } from './data/courseData'       // fallback estático
import { catalogData } from './data/catalogData'     // fallback estático
import { loadCourse, loadCatalog } from './data/courseLoader'
import AcademyLanding from './components/AcademyLanding'
import CourseLayout from './components/CourseLayout'
import Dashboard from './components/Dashboard'
import AuthModal from './components/AuthModal'

const EMPTY_PROGRESS = { completedLessons: [], completedQuizzes: {}, quizScores: {} }

function sessionFromSupabaseUser(u) {
  if (!u) return null
  return {
    userId:     u.id,
    name:       u.user_metadata?.name       ?? u.email,
    email:      u.email,
    empresa:    u.user_metadata?.empresa    ?? '',
    avatar_url: u.user_metadata?.avatar_url ?? null,
  }
}

// view: 'landing' | 'dashboard' | 'course'
export default function App() {
  const [user, setUser]           = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [view, setView]           = useState('landing')
  const [authModal, setAuthModal] = useState(null)
  const [progress, setProgress]   = useState(EMPTY_PROGRESS)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeQuiz, setActiveQuiz]     = useState(null)
  const [assignedCourses, setAssignedCourses] = useState([])
  const [activeCourseData, setActiveCourseData] = useState(courseData)  // datos del curso activo
  const [catalog, setCatalog]     = useState(catalogData)               // catálogo dinámico

  // ── userRole: state separado, nunca sobreescrito por auth events ──
  const [userRole, setUserRole] = useState(
    () => sessionStorage.getItem('userRole') || null
  )

  // ── Carga el catálogo desde Supabase al iniciar ──
  useEffect(() => {
    loadCatalog().then(data => { if (data?.length) setCatalog(data) })
  }, [])

  // ── Supabase auth subscription ──
  // setUser solo guarda datos de auth — nunca toca userRole
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(sessionFromSupabaseUser(data?.user ?? null))
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.auth.getUser().then(({ data }) => {
          setUser(sessionFromSupabaseUser(data?.user ?? null))
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Carga el rol UNA SOLA VEZ por userId — solo depende de user?.userId ──
  useEffect(() => {
    if (!user?.userId) return
    console.log('[role] cargando rol para userId:', user.userId)
    loadUserRole(user.userId).then(role => {
      console.log('[role] rol cargado:', role)
      sessionStorage.setItem('userRole', role)
      setUserRole(role)
    })
  }, [user?.userId])

  // ── Load assigned courses (activum users only) ──
  useEffect(() => {
    if (!user?.userId || userRole !== 'activum') { setAssignedCourses([]); return }
    supabase.from('course_assignments').select('course_id').eq('user_id', user.userId)
      .then(({ data }) => setAssignedCourses(data?.map(r => r.course_id) ?? []))
  }, [user?.userId, userRole])

  // ── Load course progress ──
  useEffect(() => {
    if (!user) { setProgress(EMPTY_PROGRESS); return }
    loadProgress(user.userId, 'tokenizacion-inmobiliaria').then(setProgress)
  }, [user?.userId])

  // ── Visible catalog by role (usa catálogo dinámico de Supabase) ──
  const visibleCatalog = useMemo(() => {
    if (!userRole) return catalog.filter(c => c.type === 'public')
    if (userRole === 'admin')   return catalog
    if (userRole === 'activum') return catalog.filter(c => c.type === 'public' || assignedCourses.includes(c.id))
    return catalog.filter(c => c.type === 'public')
  }, [userRole, assignedCourses, catalog])

  // ── Objeto user enriquecido con role para pasar a componentes ──
  const userWithRole = user ? { ...user, role: userRole } : null

  const persistProgress = async (next) => {
    setProgress(next)
    if (user) await saveProgress(user.userId, 'tokenizacion-inmobiliaria', next)
  }

  const totalLessons = activeCourseData.modules.reduce((a, m) => a + m.lessons.length, 0)
  const overallProgress = Math.round(
    ((progress.completedLessons.length + Object.keys(progress.completedQuizzes).length) /
    (totalLessons + courseData.modules.length)) * 100
  )

  const handleEnterCourse = async (courseId) => {
    if (!user) { setAuthModal('register'); return }
    setView('course')

    // Carga el curso desde Supabase (con fallback a estático)
    const data = await loadCourse(courseId)
    if (data) setActiveCourseData(data)

    const modules = (data ?? courseData).modules
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          setActiveLesson({ moduleId: mod.id, lessonId: lesson.id })
          setActiveQuiz(null)
          return
        }
      }
    }
    setActiveLesson(null); setActiveQuiz(null)
  }

  const handleLogout = async () => {
    await logout()
    sessionStorage.removeItem('userRole')
    setUserRole(null)
    setUser(null)
    setView('landing')
    setProgress(EMPTY_PROGRESS)
    setAssignedCourses([])
  }

  const userProgressMap = user ? { 'tokenizacion-inmobiliaria': progress } : {}

  if (!authReady) return null

  if (view === 'course') {
    return (
      <CourseLayout
        courseData={activeCourseData}
        progress={progress}
        activeLesson={activeLesson}
        activeQuiz={activeQuiz}
        overallProgress={overallProgress}
        totalLessons={totalLessons}
        completedCount={progress.completedLessons.length}
        user={userWithRole}
        onSelectLesson={(mid, lid) => { setActiveLesson({ moduleId: mid, lessonId: lid }); setActiveQuiz(null) }}
        onSelectQuiz={(mid) => { setActiveQuiz(mid); setActiveLesson(null) }}
        onCompleteLesson={(id) => {
          const next = { ...progress, completedLessons: progress.completedLessons.includes(id) ? progress.completedLessons : [...progress.completedLessons, id] }
          persistProgress(next)
        }}
        onCompleteQuiz={(mid, score) => {
          const next = { ...progress, completedQuizzes: { ...progress.completedQuizzes, [mid]: true }, quizScores: { ...progress.quizScores, [mid]: score } }
          persistProgress(next)
        }}
        onGoHome={() => setView('landing')}
        onReset={() => persistProgress(EMPTY_PROGRESS)}
      />
    )
  }

  if (view === 'dashboard') {
    return (
      <Dashboard
        user={userWithRole}
        catalog={visibleCatalog}
        userProgressMap={userProgressMap}
        onEnterCourse={handleEnterCourse}
        onGoHome={() => setView('landing')}
        onLogout={handleLogout}
        onUserUpdate={(u) => setUser(u)}
      />
    )
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
        onOpenDashboard={() => setView('dashboard')}
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
