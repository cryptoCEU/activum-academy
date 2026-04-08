import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabase'
import { logout, loadProgress, saveProgress, loadUserRole } from './auth'
import { courseData } from './data/courseData'           // fallback estático
import { flexLivingData } from './data/flexLivingData' // fallback estático

const COURSE_MAP = {
  'tokenizacion-inmobiliaria': courseData,
  'flex-living-espana':        flexLivingData,
}
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
  const [view, setView]                   = useState('landing')
  const [dashboardSection, setDashboardSection] = useState('cursos')
  const [authModal, setAuthModal]         = useState(null)
  const [progressMap, setProgressMap] = useState({})   // { courseId: progress }
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeQuiz, setActiveQuiz]     = useState(null)
  const [assignedCourses, setAssignedCourses] = useState([])
  const [activeCourseId, setActiveCourseId]     = useState('tokenizacion-inmobiliaria')
  const [activeCourseData, setActiveCourseData] = useState(courseData)
  const [catalog, setCatalog]     = useState(catalogData)

  // ── userRole: state separado, nunca sobreescrito por auth events ──
  const [userRole, setUserRole] = useState(
    () => sessionStorage.getItem('userRole') || null
  )

  // ── Carga el catálogo desde Supabase al iniciar ──
  useEffect(() => {
    loadCatalog().then(data => { if (data?.length) setCatalog(data) })
  }, [])

  // ── Supabase auth subscription ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(sessionFromSupabaseUser(data?.user ?? null))
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthModal('reset')
        return
      }
      if (event === 'SIGNED_IN' && session?.user) {
        supabase.auth.getUser().then(({ data }) => {
          setUser(sessionFromSupabaseUser(data?.user ?? null))
        })
        setAuthModal(null)
        return
      }
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

  // ── Carga el rol UNA SOLA VEZ por userId ──
  useEffect(() => {
    if (!user?.userId) return
    loadUserRole(user.userId).then(role => {
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

  // ── Carga el progreso de todos los cursos al hacer login ──
  useEffect(() => {
    if (!user) { setProgressMap({}); return }
    Promise.all(
      catalogData.map(c =>
        loadProgress(user.userId, c.id).then(p => ({ id: c.id, p }))
      )
    ).then(results => {
      const map = {}
      results.forEach(({ id, p }) => { map[id] = p })
      setProgressMap(map)
    })
  }, [user?.userId])

  // ── Cuando se entra a un curso nuevo, asegurarse de que su progreso está cargado ──
  useEffect(() => {
    if (!user || progressMap[activeCourseId] !== undefined) return
    loadProgress(user.userId, activeCourseId).then(p =>
      setProgressMap(prev => ({ ...prev, [activeCourseId]: p }))
    )
  }, [activeCourseId, user?.userId])

  // ── Visible catalog by role ──
  const visibleCatalog = useMemo(() => {
    if (!userRole) return catalog.filter(c => c.type === 'public')
    if (userRole === 'admin')   return catalog
    if (userRole === 'activum') return catalog.filter(c => c.type === 'public' || assignedCourses.includes(c.id))
    return catalog.filter(c => c.type === 'public')
  }, [userRole, assignedCourses, catalog])

  const userWithRole = user ? { ...user, role: userRole } : null

  // Progreso del curso activo
  const progress = progressMap[activeCourseId] ?? EMPTY_PROGRESS

  const persistProgress = async (next) => {
    setProgressMap(prev => ({ ...prev, [activeCourseId]: next }))
    if (user) await saveProgress(user.userId, activeCourseId, next)
  }

  const totalLessons = activeCourseData.modules.reduce((a, m) => a + m.lessons.length, 0)
  const overallProgress = Math.round(
    ((progress.completedLessons.length + Object.keys(progress.completedQuizzes).length) /
    (totalLessons + activeCourseData.modules.length)) * 100
  )

  const handleEnterCourse = async (courseId) => {
    if (!user) { setAuthModal('register'); return }
    setView('course')
    setActiveCourseId(courseId)

    const data = await loadCourse(courseId)
    if (data) setActiveCourseData(data)

    // Usar el progreso ya cargado en el mapa
    const courseProgress = progressMap[courseId] ?? EMPTY_PROGRESS
    const modules = (data ?? COURSE_MAP[courseId] ?? courseData).modules
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!courseProgress.completedLessons.includes(lesson.id)) {
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
    setProgressMap({})
    setAssignedCourses([])
  }

  const userProgressMap = user ? progressMap : {}

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
        initialSection={dashboardSection}
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
        onOpenDashboard={(section = 'cursos') => { setDashboardSection(section); setView('dashboard') }}
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
