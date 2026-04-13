import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

// ── Pricing ($ per million tokens) ───────────────────────────────────────────
const PRICING = {
  'claude-sonnet-4-6': { input: 3.0,  output: 15.0 },
  'claude-opus-4-6':   { input: 15.0, output: 75.0 },
  'claude-haiku-4-5':  { input: 0.8,  output: 4.0  },
}
const calcCost = (model, inp, out) => {
  const p = PRICING[model] ?? PRICING['claude-sonnet-4-6']
  return (inp / 1_000_000) * p.input + (out / 1_000_000) * p.output
}
const fmtCost = v => v < 0.01 ? '<$0.01' : `$${v.toFixed(2)}`
const fmtNum  = v => v?.toLocaleString('es-ES') ?? '—'

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-5 bg-act-burg" />
      <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">{children}</span>
    </div>
  )
}

function StatCard({ label, value, sub, color = 'burg' }) {
  return (
    <div className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
      <div className="text-[10px] font-medium text-act-beige3 tracking-[0.15em] uppercase mb-2">{label}</div>
      <div className={`font-display text-3xl font-semibold mb-1 ${color === 'burg' ? 'text-act-burg' : 'text-act-black'}`}>{value}</div>
      {sub && <div className="text-xs text-act-beige3">{sub}</div>}
    </div>
  )
}

function Bar({ pct, label }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-act-beige2 rounded-full overflow-hidden">
        <div className="h-full bg-act-burg transition-all duration-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs font-medium text-act-black w-8 text-right flex-shrink-0">{pct}%</span>
    </div>
  )
}

function Th({ children, right }) {
  return (
    <th className={`px-3 py-2.5 text-[10px] font-semibold text-act-beige3 tracking-[0.12em] uppercase border-b border-act-beige2 whitespace-nowrap ${right ? 'text-right' : 'text-left'}`}>
      {children}
    </th>
  )
}
function Td({ children, right, mono, muted }) {
  return (
    <td className={`px-3 py-2.5 text-sm border-b border-act-beige1 ${right ? 'text-right' : ''} ${mono ? 'font-mono' : ''} ${muted ? 'text-act-beige3' : 'text-act-black'}`}>
      {children}
    </td>
  )
}

const SETUP_SQL = `-- Ejecuta esto en Supabase > SQL Editor
create table if not exists ai_usage (
  id           uuid default gen_random_uuid() primary key,
  course_id    text,
  course_title text,
  model        text default 'claude-sonnet-4-6',
  input_tokens  integer default 0,
  output_tokens integer default 0,
  created_at   timestamptz default now()
);
alter table ai_usage enable row level security;
create policy "ai_usage_read"   on ai_usage for select to authenticated using (true);
create policy "ai_usage_insert" on ai_usage for insert to authenticated with check (true);`

// ── Main component ────────────────────────────────────────────────────────────

export default function Statistics() {
  const [loading, setLoading]       = useState(true)
  const [stats, setStats]           = useState(null)
  const [aiRows, setAiRows]         = useState(null)
  const [aiMissing, setAiMissing]   = useState(false)
  const [sqlCopied, setSqlCopied]   = useState(false)
  const [tab, setTab]               = useState('cursos')

  useEffect(() => { load() }, [])

  async function load() {
    const [coursesRes, profilesRes, progressRes, assignRes, aiRes] = await Promise.all([
      supabase.from('courses').select('id, title, status, type, total_modules, total_lessons').order('created_at'),
      supabase.from('profiles').select('id, role'),
      supabase.from('progress').select('user_id, course_id, progress'),
      supabase.from('course_assignments').select('user_id, course_id'),
      supabase.from('ai_usage').select('*').order('created_at', { ascending: false }),
    ])

    // AI usage table may not exist yet
    if (aiRes.error?.code === '42P01') {
      setAiMissing(true)
    } else {
      setAiRows(aiRes.data ?? [])
    }

    const courses     = coursesRes.data ?? []
    const profiles    = profilesRes.data ?? []
    const allProgress = progressRes.data ?? []
    const assignments = assignRes.data ?? []

    // ── Per-course stats ─────────────────────────────────────────────────────
    const courseStats = courses.map(course => {
      const total      = (course.total_lessons ?? 0) + (course.total_modules ?? 0)
      const progRows   = allProgress.filter(p => p.course_id === course.id)
      const assignedSet = new Set(assignments.filter(a => a.course_id === course.id).map(a => a.user_id))
      const progSet     = new Set(progRows.map(p => p.user_id))
      const enrolled    = new Set([...assignedSet, ...progSet]).size

      let started = 0, completed = 0
      const scores = []

      progRows.forEach(p => {
        const prog = p.progress ?? {}
        const done = (prog.completedLessons?.length ?? 0) + Object.keys(prog.completedQuizzes ?? {}).length
        if (done > 0) started++
        if (total > 0 && done >= total) {
          completed++
          Object.values(prog.quizScores ?? {}).forEach(s => scores.push(Number(s)))
        }
      })

      const avgQuiz = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

      return { ...course, enrolled, started, completed, avgQuiz,
        completionRate: started > 0 ? Math.round((completed / started) * 100) : 0 }
    })

    // ── Global KPIs ──────────────────────────────────────────────────────────
    const totalLessonsCompleted = allProgress.reduce((s, p) =>
      s + ((p.progress?.completedLessons?.length) ?? 0), 0)

    const published = courses.filter(c => c.status === 'published')
    const activeUserIds = new Set(allProgress.filter(p => {
      const prog = p.progress ?? {}
      return (prog.completedLessons?.length ?? 0) + Object.keys(prog.completedQuizzes ?? {}).length > 0
    }).map(p => p.user_id))

    const completedPairs = new Set()
    allProgress.forEach(p => {
      const course = courses.find(c => c.id === p.course_id)
      if (!course) return
      const total = (course.total_lessons ?? 0) + (course.total_modules ?? 0)
      const done  = (p.progress?.completedLessons?.length ?? 0) + Object.keys(p.progress?.completedQuizzes ?? {}).length
      if (total > 0 && done >= total) completedPairs.add(`${p.user_id}:${p.course_id}`)
    })

    // ── User breakdown ───────────────────────────────────────────────────────
    const roleCount = {}
    profiles.forEach(p => { roleCount[p.role ?? 'user'] = (roleCount[p.role ?? 'user'] ?? 0) + 1 })

    // Top learners
    const userLessons = {}
    allProgress.forEach(p => {
      const done = p.progress?.completedLessons?.length ?? 0
      userLessons[p.user_id] = (userLessons[p.user_id] ?? 0) + done
    })
    const topLearners = Object.entries(userLessons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, lessons]) => {
        const profile = profiles.find(p => p.id === userId)
        return { userId, lessons, name: profile?.name ?? 'Usuario', role: profile?.role ?? 'user' }
      })

    setStats({
      courses: courseStats,
      totalCourses: courses.length,
      published: published.length,
      totalLessonsCompleted,
      completedEnrollments: completedPairs.size,
      activeUsers: activeUserIds.size,
      totalUsers: profiles.length,
      roleCount,
      topLearners,
    })
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando estadísticas...</span>
    </div>
  )

  // ── AI totals ────────────────────────────────────────────────────────────────
  const aiTotals = (aiRows ?? []).reduce((acc, r) => ({
    count:  acc.count + 1,
    input:  acc.input  + (r.input_tokens  ?? 0),
    output: acc.output + (r.output_tokens ?? 0),
    cost:   acc.cost   + calcCost(r.model, r.input_tokens ?? 0, r.output_tokens ?? 0),
  }), { count: 0, input: 0, output: 0, cost: 0 })

  const publishedCourses  = stats.courses.filter(c => c.status === 'published')
  const comingSoonCourses = stats.courses.filter(c => c.status === 'coming_soon')
  const draftCourses      = stats.courses.filter(c => c.status === 'draft')

  const TABS = [
    { id: 'cursos',   label: 'Cursos' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'ia',       label: 'Generación IA' },
  ]

  return (
    <div className="max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Estadísticas</h1>
        <p className="text-sm text-act-beige3">Análisis de uso y rendimiento de la plataforma</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Cursos publicados"    value={stats.published}             sub={`de ${stats.totalCourses} totales`} />
        <StatCard label="Usuarios activos"     value={stats.activeUsers}           sub={`de ${stats.totalUsers} registrados`} color="black" />
        <StatCard label="Lecciones completadas" value={fmtNum(stats.totalLessonsCompleted)} sub="en total" color="black" />
        <StatCard label="Cursos completados"   value={stats.completedEnrollments}  sub="completaciones" />
      </div>

      {/* Tabs */}
      <div className="border-b border-act-beige2 flex gap-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-act-burg text-act-burg'
                : 'border-transparent text-act-beige3 hover:text-act-black'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Cursos ──────────────────────────────────────────────────────── */}
      {tab === 'cursos' && (
        <div className="space-y-6">

          {/* Status summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Publicados',    value: publishedCourses.length,  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { label: 'Próximamente',  value: comingSoonCourses.length, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
              { label: 'Borrador',      value: draftCourses.length,      color: 'text-act-beige3 bg-act-beige1 border-act-beige2' },
            ].map(s => (
              <div key={s.label} className={`border px-4 py-3 text-center ${s.color}`} style={{ borderRadius: '2px' }}>
                <div className="font-display text-2xl font-semibold">{s.value}</div>
                <div className="text-[10px] font-medium tracking-widest uppercase mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Per-course table */}
          <div className="border border-act-beige2 bg-act-white overflow-hidden" style={{ borderRadius: '2px' }}>
            <SectionTitle>Rendimiento por curso</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-act-beige1/50">
                  <tr>
                    <Th>Curso</Th>
                    <Th>Estado</Th>
                    <Th right>Módulos</Th>
                    <Th right>Lecciones</Th>
                    <Th right>Inscritos</Th>
                    <Th right>Iniciados</Th>
                    <Th right>Completados</Th>
                    <Th>Tasa</Th>
                    <Th right>Media quiz</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.courses.length === 0 && (
                    <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-act-beige3">No hay cursos</td></tr>
                  )}
                  {stats.courses.map(course => (
                    <tr key={course.id} className="hover:bg-act-beige1/30 transition-colors">
                      <Td>
                        <div className="font-medium truncate max-w-[200px]">{course.title}</div>
                        <div className="text-[10px] text-act-beige3 font-mono mt-0.5">{course.id}</div>
                      </Td>
                      <Td>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          course.status === 'published'   ? 'bg-emerald-100 text-emerald-700' :
                          course.status === 'coming_soon' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-act-beige1 text-act-beige3'}`}>
                          {course.status === 'published' ? 'Publicado' : course.status === 'coming_soon' ? 'Próximo' : 'Borrador'}
                        </span>
                      </Td>
                      <Td right mono>{course.total_modules ?? '—'}</Td>
                      <Td right mono>{course.total_lessons ?? '—'}</Td>
                      <Td right mono>{course.enrolled}</Td>
                      <Td right mono>{course.started}</Td>
                      <Td right mono>{course.completed}</Td>
                      <Td>
                        {course.started > 0
                          ? <Bar pct={course.completionRate} />
                          : <span className="text-act-beige3 text-xs">—</span>}
                      </Td>
                      <Td right>
                        {course.avgQuiz != null
                          ? <span className="font-medium text-act-burg">{course.avgQuiz}%</span>
                          : <span className="text-act-beige3">—</span>}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Usuarios ────────────────────────────────────────────────────── */}
      {tab === 'usuarios' && (
        <div className="space-y-6">

          {/* Role breakdown */}
          <div className="border border-act-beige2 bg-act-white p-6" style={{ borderRadius: '2px' }}>
            <SectionTitle>Distribución por rol</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { rol: 'admin',   label: 'Administradores', color: 'bg-act-burg/10 text-act-burg border-act-burg/20' },
                { rol: 'activum', label: 'Activum',         color: 'bg-act-beige1 text-act-black border-act-beige2' },
                { rol: 'user',    label: 'Usuarios básicos',color: 'bg-act-beige1/50 text-act-beige3 border-act-beige2' },
              ].map(({ rol, label, color }) => (
                <div key={rol} className={`border px-4 py-4 text-center ${color}`} style={{ borderRadius: '2px' }}>
                  <div className="font-display text-3xl font-semibold">{stats.roleCount[rol] ?? 0}</div>
                  <div className="text-[10px] font-medium tracking-widest uppercase mt-1 opacity-70">{label}</div>
                </div>
              ))}
              <div className="border border-act-beige2 bg-act-white px-4 py-4 text-center" style={{ borderRadius: '2px' }}>
                <div className="font-display text-3xl font-semibold text-act-black">{stats.activeUsers}</div>
                <div className="text-[10px] font-medium tracking-widest uppercase mt-1 text-act-beige3">Con actividad</div>
              </div>
            </div>
          </div>

          {/* Activity rate */}
          <div className="border border-act-beige2 bg-act-white p-6" style={{ borderRadius: '2px' }}>
            <SectionTitle>Actividad</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-act-black/60">Usuarios con actividad</span>
                  <span className="font-medium text-act-black">{stats.activeUsers} / {stats.totalUsers}</span>
                </div>
                <Bar pct={stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-act-black/60">Completaciones de curso</span>
                  <span className="font-medium text-act-black">{stats.completedEnrollments}</span>
                </div>
                <Bar pct={stats.activeUsers > 0 ? Math.min(100, Math.round((stats.completedEnrollments / stats.activeUsers) * 100)) : 0} />
              </div>
            </div>
          </div>

          {/* Top learners */}
          {stats.topLearners.length > 0 && (
            <div className="border border-act-beige2 bg-act-white p-6" style={{ borderRadius: '2px' }}>
              <SectionTitle>Top learners</SectionTitle>
              <div className="space-y-2">
                {stats.topLearners.map((u, i) => (
                  <div key={u.userId} className="flex items-center gap-3 px-3 py-2.5 border border-act-beige1 bg-act-beige1/30" style={{ borderRadius: '2px' }}>
                    <span className="text-[10px] font-mono text-act-beige3 w-4">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-act-beige2 flex items-center justify-center text-xs font-semibold text-act-black flex-shrink-0">
                      {(u.name[0] ?? '?').toUpperCase()}
                    </div>
                    <span className="text-sm text-act-black flex-1 font-medium truncate">{u.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.role === 'activum' ? 'bg-act-burg/10 text-act-burg' : u.role === 'admin' ? 'bg-act-burg text-white' : 'bg-act-beige1 text-act-beige3'}`}>
                      {u.role}
                    </span>
                    <span className="text-sm font-medium text-act-black">{u.lessons}</span>
                    <span className="text-[10px] text-act-beige3">lecciones</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: IA ──────────────────────────────────────────────────────────── */}
      {tab === 'ia' && (
        <div className="space-y-6">

          {/* Setup banner if table missing */}
          {aiMissing && (
            <div className="border border-yellow-200 bg-yellow-50 p-5 space-y-3" style={{ borderRadius: '2px' }}>
              <p className="text-sm text-yellow-800 font-medium">La tabla <code className="font-mono bg-yellow-100 px-1 rounded">ai_usage</code> no existe aún. Ejecútala en Supabase → SQL Editor:</p>
              <pre className="text-xs bg-white border border-yellow-200 p-3 rounded overflow-x-auto text-act-black leading-relaxed">{SETUP_SQL}</pre>
              <button
                onClick={() => { navigator.clipboard.writeText(SETUP_SQL); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000) }}
                className="text-xs px-3 py-1.5 border border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-100 transition-colors"
                style={{ borderRadius: '2px' }}>
                {sqlCopied ? 'Copiado' : 'Copiar SQL'}
              </button>
            </div>
          )}

          {/* Totals */}
          {!aiMissing && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Generaciones"     value={aiTotals.count}            sub="cursos generados" />
                <StatCard label="Tokens entrada"   value={fmtNum(aiTotals.input)}    sub="input tokens" color="black" />
                <StatCard label="Tokens salida"    value={fmtNum(aiTotals.output)}   sub="output tokens" color="black" />
                <StatCard label="Coste estimado"   value={fmtCost(aiTotals.cost)}    sub="USD acumulado" />
              </div>

              {/* Cost note */}
              <p className="text-xs text-act-beige3">
                Precios de referencia claude-sonnet-4-6: $3.00/MTok entrada · $15.00/MTok salida.
              </p>

              {/* History table */}
              <div className="border border-act-beige2 bg-act-white overflow-hidden" style={{ borderRadius: '2px' }}>
                <div className="p-6 pb-0">
                  <SectionTitle>Historial de generaciones</SectionTitle>
                </div>
                {aiRows.length === 0 ? (
                  <p className="px-6 pb-6 text-sm text-act-beige3">Aún no hay generaciones registradas. Los próximos cursos generados con IA aparecerán aquí.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-act-beige1/50">
                        <tr>
                          <Th>Curso</Th>
                          <Th>Modelo</Th>
                          <Th right>Tokens entrada</Th>
                          <Th right>Tokens salida</Th>
                          <Th right>Coste</Th>
                          <Th>Fecha</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiRows.map(row => {
                          const cost = calcCost(row.model, row.input_tokens ?? 0, row.output_tokens ?? 0)
                          return (
                            <tr key={row.id} className="hover:bg-act-beige1/30 transition-colors">
                              <Td>
                                <div className="font-medium truncate max-w-[220px]">{row.course_title ?? row.course_id ?? '—'}</div>
                                {row.course_id && <div className="text-[10px] text-act-beige3 font-mono">{row.course_id}</div>}
                              </Td>
                              <Td muted><span className="font-mono text-xs">{row.model ?? '—'}</span></Td>
                              <Td right mono>{fmtNum(row.input_tokens)}</Td>
                              <Td right mono>{fmtNum(row.output_tokens)}</Td>
                              <Td right>
                                <span className="font-medium text-act-burg">{fmtCost(cost)}</span>
                              </Td>
                              <Td muted>
                                {row.created_at
                                  ? new Date(row.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : '—'}
                              </Td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot className="bg-act-beige1/30">
                        <tr>
                          <td colSpan={2} className="px-3 py-2.5 text-xs font-semibold text-act-black uppercase tracking-widest">Total</td>
                          <td className="px-3 py-2.5 text-right text-sm font-mono font-medium text-act-black">{fmtNum(aiTotals.input)}</td>
                          <td className="px-3 py-2.5 text-right text-sm font-mono font-medium text-act-black">{fmtNum(aiTotals.output)}</td>
                          <td className="px-3 py-2.5 text-right text-sm font-medium text-act-burg">{fmtCost(aiTotals.cost)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
