import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function fmt(date) {
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatCard({ label, value, sub }) {
  return (
    <div className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
      <div className="font-display text-3xl font-light text-act-black mb-1">{value ?? '—'}</div>
      <div className="text-xs font-medium text-act-black/70 tracking-wide">{label}</div>
      {sub && <div className="text-xs text-act-beige3 mt-0.5">{sub}</div>}
    </div>
  )
}

function QuickLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border border-act-beige2 bg-act-white px-4 py-3 text-sm font-medium text-act-black hover:border-act-burg hover:text-act-burg transition-colors"
      style={{ borderRadius: '2px' }}
    >
      {label}
      <svg className="w-3.5 h-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  )
}

export default function Dashboard({ onNavigate }) {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, coursesRes, progressRes, profilesRes] = await Promise.all([
        supabase.from('profiles').select('id, role, email', { count: 'exact' }),
        supabase.from('courses').select('id, status'),
        supabase.from('progress').select('user_id, course_id, progress, updated_at')
          .order('updated_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('id, email'),
      ])

      const users    = usersRes.data  ?? []
      const courses  = coursesRes.data ?? []
      const progress = progressRes.data ?? []
      const profiles = profilesRes.data ?? []
      const profileMap = Object.fromEntries(profiles.map(p => [p.id, p.email]))

      const activumCount     = users.filter(u => u.role === 'activum' || u.email?.includes('@activum.es')).length
      const publishedCount   = courses.filter(c => c.status === 'published').length

      const allPcts = progress.map(p => {
        const lessons = p.progress?.completedLessons?.length ?? 0
        return lessons
      })
      const avgProgress = allPcts.length
        ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length)
        : 0

      setStats({
        totalUsers:    usersRes.count ?? users.length,
        activumCount,
        publishedCount,
        avgProgress,
      })
      setRecent(progress.map(p => ({ ...p, userLabel: profileMap[p.user_id] ?? p.user_id.slice(0, 8) + '…' })))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando...</span>
    </div>
  )

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Panel</h1>
        <p className="text-sm text-act-beige3">Resumen general de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total usuarios"      value={stats.totalUsers}    />
        <StatCard label="Equipo @activum.es"  value={stats.activumCount}  />
        <StatCard label="Cursos publicados"   value={stats.publishedCount}/>
        <StatCard label="Progreso medio"      value={`${stats.avgProgress}%`} sub="lecciones completadas" />
      </div>

      {/* Quick links */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Accesos rápidos</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <QuickLink label="Crear curso con IA"  onClick={() => onNavigate('ai-generator')} />
          <QuickLink label="Ver usuarios"        onClick={() => onNavigate('users')}        />
          <QuickLink label="Gestionar cursos"    onClick={() => onNavigate('courses')}      />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Actividad reciente</span>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-act-beige3">Sin actividad registrada.</p>
        ) : (
          <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
            <table className="w-full min-w-[540px]">
              <thead className="bg-act-beige1">
                <tr>
                  {['Usuario', 'Curso', 'Lecciones', 'Última actividad'].map(h => (
                    <th key={h} className="text-left text-[11px] font-medium text-act-beige3 tracking-widest uppercase py-3 px-4 border-b border-act-beige2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((p, i) => (
                  <tr key={i} className="hover:bg-act-beige1/40 transition-colors">
                    <td className="py-3 px-4 text-xs text-act-black/60 border-b border-act-beige1">{p.userLabel}</td>
                    <td className="py-3 px-4 text-xs text-act-black border-b border-act-beige1">{p.course_id}</td>
                    <td className="py-3 px-4 text-xs text-act-black border-b border-act-beige1">{p.progress?.completedLessons?.length ?? 0}</td>
                    <td className="py-3 px-4 text-xs text-act-beige3 border-b border-act-beige1">{fmt(p.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
