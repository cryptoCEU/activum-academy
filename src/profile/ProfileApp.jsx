import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function fmt(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

function pct(p, course) {
  const lessons = p?.completedLessons?.length ?? 0
  const quizzes = Object.keys(p?.completedQuizzes ?? {}).length
  const total   = (course.total_lessons ?? 0) + (course.total_modules ?? 0)
  return total === 0 ? 0 : Math.round((lessons + quizzes) / total * 100)
}

export default function ProfileApp() {
  const userId = window.location.pathname.replace(/^\/u\//, '').split('/')[0]

  const [profile,   setProfile]   = useState(null)
  const [completed, setCompleted] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [notFound,  setNotFound]  = useState(false)

  useEffect(() => {
    if (!userId) { setNotFound(true); setLoading(false); return }

    async function load() {
      const [profileRes, progressRes, coursesRes] = await Promise.all([
        supabase.from('profiles').select('id, name, empresa, bio, avatar_url').eq('id', userId).single(),
        supabase.from('progress').select('course_id, progress, updated_at').eq('user_id', userId),
        supabase.from('courses').select('id, title, subtitle, badge, total_lessons, total_modules').eq('status', 'published'),
      ])

      if (profileRes.error || !profileRes.data) { setNotFound(true); setLoading(false); return }

      const progress   = progressRes.data ?? []
      const allCourses = coursesRes.data ?? []

      const done = allCourses
        .map(course => {
          const p = progress.find(x => x.course_id === course.id)
          if (!p) return null
          const percent = pct(p.progress, course)
          if (percent < 100) return null
          const scores = Object.values(p.progress?.quizScores ?? {})
          const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
          return { ...course, completedAt: p.updated_at, avgScore }
        })
        .filter(Boolean)

      setProfile(profileRes.data)
      setCompleted(done)
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) return (
    <div className="min-h-screen bg-act-white flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-act-white flex flex-col items-center justify-center gap-4 px-4">
      <img src="/logo.svg" alt="Activum Academy" className="h-8 opacity-60" />
      <p className="text-act-beige3 text-sm">Perfil no encontrado.</p>
      <a href="/" className="text-xs text-act-burg hover:underline">Volver al inicio</a>
    </div>
  )

  const initial = (profile.name?.[0] ?? profile.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="min-h-screen bg-act-white">
      {/* Nav */}
      <header className="border-b border-act-beige1 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Activum Academy" className="h-7" />
        </a>
        <a href="/" className="text-xs text-act-beige3 hover:text-act-black transition-colors">
          Explorar cursos
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0" style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: '#EDE3D8', border: '2px solid #D9C9B8' }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 38, color: '#1E1D16' }}>
                {initial}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold text-act-black leading-tight">
              {profile.name || 'Usuario'}
            </h1>
            {profile.empresa && (
              <p className="text-sm text-act-beige3 mt-1">{profile.empresa}</p>
            )}
            {profile.bio && (
              <p className="text-sm text-act-black/70 mt-3 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-5 bg-act-burg" />
            <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">
              Certificaciones obtenidas
            </span>
          </div>

          {completed.length === 0 ? (
            <p className="text-sm text-act-beige3">Aún no hay cursos completados.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {completed.map(course => (
                <div key={course.id} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-8 h-8 bg-act-burg/10 border border-act-burg/20 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '2px' }}>
                      <svg className="w-4 h-4 text-act-burg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    {course.badge && (
                      <span className="text-[10px] font-medium text-act-burg bg-act-burg/5 border border-act-burg/20 px-2 py-0.5" style={{ borderRadius: '2px' }}>
                        {course.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold text-act-black leading-snug">{course.title}</h3>
                  {course.subtitle && <p className="text-xs text-act-beige3 mt-1 leading-relaxed">{course.subtitle}</p>}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-act-beige1">
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completado
                    </span>
                    {course.avgScore != null && (
                      <span className="text-[10px] text-act-burg font-medium">{course.avgScore}% media quizzes</span>
                    )}
                    {course.completedAt && (
                      <span className="text-[10px] text-act-beige3 ml-auto">{fmt(course.completedAt)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-act-beige1 pt-8 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Activum Academy" className="h-5 opacity-50" />
          </a>
          <p className="text-xs text-act-beige3">Activum Academy</p>
        </div>
      </main>
    </div>
  )
}
