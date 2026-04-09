import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AdminLogin from './AdminLogin'
import Dashboard    from './pages/Dashboard'
import Users        from './pages/Users'
import Courses      from './pages/Courses'
import CourseEditor from './pages/CourseEditor'
import LessonEditor from './pages/LessonEditor'
import AIGenerator  from './pages/AIGenerator'
import Assignments  from './pages/Assignments'

// ── SVG icons ─────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
function IconCourses() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}
function IconAI() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
function IconAssign() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
function IconChevron() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard',   label: 'Panel',          Icon: IconDashboard },
  { id: 'users',       label: 'Usuarios',        Icon: IconUsers     },
  { id: 'courses',     label: 'Cursos',          Icon: IconCourses   },
  { id: 'ai-generator',label: 'Generador IA',   Icon: IconAI        },
  { id: 'assignments', label: 'Asignaciones',    Icon: IconAssign    },
]

const PAGE_LABELS = {
  dashboard:     'Panel',
  users:         'Usuarios',
  courses:       'Cursos',
  'course-editor': 'Editor de curso',
  'lesson-editor': 'Editor de lección',
  'ai-generator':  'Generador IA',
  assignments:     'Asignaciones',
}

// ── AdminApp ──────────────────────────────────────────────────────────────────

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(null)
  const [ready, setReady]         = useState(false)
  const [page, setPage]           = useState('dashboard')
  const [navParams, setNavParams] = useState({})

  // Verificar sesión activa al montar
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin') {
          setAdminUser({
            id:    data.user.id,
            name:  data.user.user_metadata?.name ?? data.user.email,
            email: data.user.email,
            role:  'admin',
          })
        }
      }
      setReady(true)
    })
  }, [])

  const navigate = (pageId, params = {}) => {
    setPage(pageId)
    setNavParams(params)
    window.scrollTo(0, 0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
  }

  if (!ready) return (
    <div className="min-h-screen bg-act-beige1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!adminUser) return <AdminLogin onSuccess={setAdminUser} />

  const initial = (adminUser.name?.[0] ?? 'A').toUpperCase()
  const firstName = adminUser.name?.split(' ')[0] ?? 'Admin'

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 w-60 border-r border-act-beige2"
        style={{ background: '#EDE3D8' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-act-beige2">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Activum" className="h-12 flex-shrink-0" />
            <span className="font-sans text-sm font-medium text-act-beige3 tracking-wide">Academy</span>
            <span
              className="ml-auto text-[10px] font-medium tracking-widest px-1.5 py-0.5 flex-shrink-0"
              style={{ background: '#8C1736', color: '#fff', borderRadius: '2px' }}
            >
              ADMIN
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id || (id === 'courses' && (page === 'course-editor' || page === 'lesson-editor'))
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left transition-colors"
                style={{
                  borderRadius: '2px',
                  color:      active ? '#8C1736' : '#1E1D16',
                  background: active ? 'rgba(140,23,54,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #8C1736' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(30,29,22,0.06)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon />
                {label}
              </button>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 pb-4 border-t border-act-beige2 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div
              className="w-7 h-7 flex items-center justify-center font-display font-semibold text-sm flex-shrink-0"
              style={{ borderRadius: '50%', background: '#8C1736', color: '#fff' }}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-act-black truncate">{firstName}</div>
              <div className="text-[11px] text-act-beige3 truncate">{adminUser.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left text-act-beige3 hover:text-act-black"
            style={{ borderRadius: '2px' }}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-act-white">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-8 h-14 flex-shrink-0 border-b"
          style={{ borderColor: '#EDE3D8', background: '#F7F2EA' }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-act-beige3">
            <span className="font-medium tracking-widest uppercase">Admin</span>
            <IconChevron />
            <span className="text-act-black font-medium">{PAGE_LABELS[page] ?? page}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-act-beige3 hidden sm:block">{adminUser.email}</span>
            <div
              className="w-7 h-7 flex items-center justify-center font-display font-semibold text-sm flex-shrink-0"
              style={{ borderRadius: '50%', background: '#8C1736', color: '#fff' }}
            >
              {initial}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {page === 'dashboard'     && <Dashboard   onNavigate={navigate} adminUser={adminUser} />}
          {page === 'users'         && <Users        onNavigate={navigate} />}
          {page === 'courses'       && <Courses      onNavigate={navigate} />}
          {page === 'course-editor' && <CourseEditor onNavigate={navigate} courseId={navParams.courseId} />}
          {page === 'lesson-editor' && <LessonEditor onNavigate={navigate} lessonId={navParams.lessonId} moduleId={navParams.moduleId} courseId={navParams.courseId} />}
          {page === 'ai-generator'  && <AIGenerator  onNavigate={navigate} />}
          {page === 'assignments'   && <Assignments  onNavigate={navigate} />}
        </main>
      </div>
    </div>
  )
}
