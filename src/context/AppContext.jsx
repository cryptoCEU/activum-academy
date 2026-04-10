import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabase'
import { logout, loadProgress, saveProgress, loadUserRole } from '../auth'
import { catalogData } from '../data/catalogData'
import { loadCatalog } from '../data/courseLoader'

const AppContext = createContext(null)

export const EMPTY_PROGRESS = { completedLessons: [], completedQuizzes: {}, quizScores: {} }

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

export function AppProvider({ children }) {
  const [user,           setUser]           = useState(null)
  const [authReady,      setAuthReady]      = useState(false)
  const [authModal,      setAuthModal]      = useState(null)
  const [catalog,        setCatalog]        = useState(catalogData)
  const [progressMap,    setProgressMap]    = useState({})
  const [assignedCourses, setAssignedCourses] = useState([])
  const [userRole,       setUserRole]       = useState(
    () => sessionStorage.getItem('userRole') || null
  )

  // ── Cargar catálogo ──
  useEffect(() => {
    loadCatalog().then(data => { if (data?.length) setCatalog(data) })
  }, [])

  // ── Auth subscription ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(sessionFromSupabaseUser(data?.user ?? null))
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') { setAuthModal('reset'); return }
      if (event === 'SIGNED_IN' && session?.user) {
        supabase.auth.getUser().then(({ data }) => setUser(sessionFromSupabaseUser(data?.user ?? null)))
        setAuthModal(null)
        return
      }
      if (session?.user) {
        supabase.auth.getUser().then(({ data }) => setUser(sessionFromSupabaseUser(data?.user ?? null)))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Cargar rol ──
  useEffect(() => {
    if (!user?.userId) return
    loadUserRole(user.userId).then(role => {
      sessionStorage.setItem('userRole', role)
      setUserRole(role)
    })
  }, [user?.userId])

  // ── Cargar cursos asignados (activum) ──
  useEffect(() => {
    if (!user?.userId || userRole !== 'activum') { setAssignedCourses([]); return }
    supabase.from('course_assignments').select('course_id').eq('user_id', user.userId)
      .then(({ data }) => setAssignedCourses(data?.map(r => r.course_id) ?? []))
  }, [user?.userId, userRole])

  // ── Cargar progreso al hacer login ──
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

  // ── Catálogo visible según rol ──
  const visibleCatalog = useMemo(() => {
    if (!userRole) return catalog.filter(c => c.type === 'public')
    if (userRole === 'admin')   return catalog
    if (userRole === 'activum') return catalog.filter(c => c.type === 'public' || assignedCourses.includes(c.id))
    return catalog.filter(c => c.type === 'public')
  }, [userRole, assignedCourses, catalog])

  const userWithRole    = user ? { ...user, role: userRole } : null
  const userProgressMap = user ? progressMap : {}

  const handleLogout = async () => {
    await logout()
    sessionStorage.removeItem('userRole')
    setUserRole(null)
    setUser(null)
    setProgressMap({})
    setAssignedCourses([])
  }

  // Guarda progreso en estado y en Supabase
  const persistProgress = async (courseId, next) => {
    setProgressMap(prev => ({ ...prev, [courseId]: next }))
    if (user) await saveProgress(user.userId, courseId, next)
  }

  // Carga progreso de un curso concreto si aún no está en el mapa
  const ensureProgressLoaded = async (courseId) => {
    if (!user?.userId || progressMap[courseId] !== undefined) return progressMap[courseId]
    const p = await loadProgress(user.userId, courseId)
    setProgressMap(prev => ({ ...prev, [courseId]: p }))
    return p
  }

  return (
    <AppContext.Provider value={{
      user, setUser,
      userRole,
      userWithRole,
      authReady,
      authModal, setAuthModal,
      catalog,
      visibleCatalog,
      progressMap,
      userProgressMap,
      assignedCourses,
      handleLogout,
      persistProgress,
      ensureProgressLoaded,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
