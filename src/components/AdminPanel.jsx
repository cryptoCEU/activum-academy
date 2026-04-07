import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '../supabase'
import { catalogData } from '../data/catalogData'

// ── Helpers ───────────────────────────────────────────────────────────────────

function courseTitle(courseId) {
  return catalogData.find(c => c.id === courseId)?.title ?? courseId
}
function courseLessonsCount(courseId) {
  return catalogData.find(c => c.id === courseId)?.lessons ?? 0
}
function progressPct(progressEntry, courseId) {
  const lessons = courseLessonsCount(courseId)
  if (!lessons) return 0
  return Math.round(((progressEntry?.progress?.completedLessons?.length ?? 0) / lessons) * 100)
}
function userAvgPct(userId, allProgress) {
  const entries = allProgress.filter(p => p.user_id === userId)
  if (!entries.length) return 0
  const pcts = entries.map(p => progressPct(p, p.course_id))
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}
function fmt(date) {
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const cls = {
    admin:   'bg-act-burg text-white',
    activum: 'bg-act-black text-white',
    user:    'border border-act-beige2 text-act-beige3',
  }[role] ?? 'border border-act-beige2 text-act-beige3'
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 tracking-wide whitespace-nowrap ${cls}`} style={{ borderRadius: '2px' }}>
      {role}
    </span>
  )
}

function Th({ children }) {
  return <th className="text-left text-[11px] font-medium text-act-beige3 tracking-widest uppercase pb-3 pr-4 border-b border-act-beige2">{children}</th>
}
function Td({ children, className = '' }) {
  return <td className={`py-3 pr-4 text-sm align-middle border-b border-act-beige1 ${className}`}>{children}</td>
}

function UserCell({ user }) {
  const initial = (user?.name ?? user?.email ?? '?')[0].toUpperCase()
  const displayName = user?.name || user?.email?.split('@')[0] || '—'
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 bg-act-beige1 flex items-center justify-center font-display font-semibold text-sm flex-shrink-0 text-act-black" style={{ borderRadius: '50%', border: '1px solid #D9C9B8' }}>
        {initial}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-act-black truncate">{displayName}</div>
        <div className="text-xs text-act-beige3 truncate">{user?.email}</div>
      </div>
    </div>
  )
}

function ProgressBar({ pct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-act-beige2 flex-shrink-0" style={{ borderRadius: '1px' }}>
        <div className="h-full bg-act-burg" style={{ width: `${pct}%`, borderRadius: '1px' }} />
      </div>
      <span className="text-xs text-act-burg font-medium">{pct}%</span>
    </div>
  )
}

function SecTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-5 bg-act-burg flex-shrink-0" />
      <h3 className="font-display text-lg font-semibold text-act-black">{children}</h3>
    </div>
  )
}

function Alert({ type, children }) {
  const cls = {
    success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    error:   'text-act-burg bg-red-50 border-red-100',
    info:    'text-act-black/70 bg-act-beige1 border-act-beige2',
  }[type]
  return <div className={`text-xs border px-3 py-2.5 ${cls}`} style={{ borderRadius: '2px' }}>{children}</div>
}

// ── Section: Resumen ─────────────────────────────────────────────────────────

function Resumen({ data }) {
  const { users, progress, totalCount } = data
  const activumCount = users.filter(u => u.role === 'activum' || u.email?.includes('@activum.es')).length
  const activeCourseCount = new Set(progress.map(p => p.course_id)).size
  const globalPcts = progress.map(p => progressPct(p, p.course_id))
  const globalAvg = globalPcts.length ? Math.round(globalPcts.reduce((a, b) => a + b, 0) / globalPcts.length) : 0
  const recent = [...progress].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 10)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total usuarios',        value: totalCount ?? users.length },
          { label: 'Equipo @activum.es',    value: activumCount },
          { label: 'Cursos con actividad',  value: activeCourseCount },
          { label: 'Progreso medio global', value: `${globalAvg}%` },
        ].map(s => (
          <div key={s.label} className="border border-act-beige2 p-5" style={{ borderRadius: '2px' }}>
            <div className="font-display text-3xl font-light text-act-black mb-1">{s.value}</div>
            <div className="text-xs text-act-beige3">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <SecTitle>Actividad reciente</SecTitle>
        {recent.length === 0 ? (
          <p className="text-sm text-act-beige3">No hay actividad registrada.</p>
        ) : (
          <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
            <table className="w-full min-w-[600px]">
              <thead className="bg-act-beige1"><tr><Th>Usuario</Th><Th>Curso</Th><Th>Progreso</Th><Th>Última actividad</Th></tr></thead>
              <tbody>
                {recent.map((p, i) => {
                  const u = users.find(u => u.id === p.user_id)
                  const pct = progressPct(p, p.course_id)
                  return (
                    <tr key={i} className="hover:bg-act-beige1/30 transition-colors">
                      <Td><UserCell user={u} /></Td>
                      <Td><span className="text-xs text-act-black/70">{courseTitle(p.course_id)}</span></Td>
                      <Td><ProgressBar pct={pct} /></Td>
                      <Td><span className="text-xs text-act-beige3">{fmt(p.updated_at)}</span></Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Todos los usuarios ───────────────────────────────────────────────

function Usuarios({ data, onChangeRole, onManageUser }) {
  const { users, assignments, progress } = data
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ), [users, search])

  return (
    <div className="space-y-4">
      <input
        type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nombre o email..."
        className="w-full max-w-sm border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
        style={{ borderRadius: '2px' }}
      />
      <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
        <table className="w-full min-w-[700px]">
          <thead className="bg-act-beige1">
            <tr><Th>Usuario</Th><Th>Rol</Th><Th>Cursos</Th><Th>Progreso</Th><Th>Cambiar rol</Th><Th></Th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-sm text-act-beige3">Sin resultados</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="hover:bg-act-beige1/30 transition-colors">
                <Td><UserCell user={u} /></Td>
                <Td><RoleBadge role={u.role} /></Td>
                <Td><span className="text-sm text-act-black">{assignments.filter(a => a.user_id === u.id).length}</span></Td>
                <Td><ProgressBar pct={userAvgPct(u.id, progress)} /></Td>
                <Td>
                  <select
                    value={u.role} onChange={e => onChangeRole(u.id, e.target.value)}
                    className="border border-act-beige2 bg-act-white text-xs px-2 py-1.5 focus:outline-none focus:border-act-burg text-act-black"
                    style={{ borderRadius: '2px' }}
                  >
                    <option value="user">user</option>
                    <option value="activum">activum</option>
                    <option value="admin">admin</option>
                  </select>
                </Td>
                <Td>
                  <button onClick={() => onManageUser(u.id)}
                    className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg hover:text-white transition-colors"
                    style={{ borderRadius: '2px' }}
                  >Gestionar</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-act-beige3">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}

// ── Section: Equipo Activum ───────────────────────────────────────────────────

function Equipo({ data, onManageUser }) {
  const { users, assignments, progress } = data
  const team = useMemo(() => users.filter(u => u.role === 'activum' || u.email?.includes('@activum.es')), [users])

  return (
    <div className="space-y-4">
      <p className="text-sm text-act-beige3">{team.length} miembro{team.length !== 1 ? 's' : ''} del equipo</p>
      <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
        <table className="w-full min-w-[600px]">
          <thead className="bg-act-beige1">
            <tr><Th>Usuario</Th><Th>Rol</Th><Th>Cursos asignados</Th><Th>Progreso</Th><Th></Th></tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-act-beige3">No hay miembros del equipo</td></tr>
            ) : team.map(u => {
              const assigned = assignments.filter(a => a.user_id === u.id)
              return (
                <tr key={u.id} className="hover:bg-act-beige1/30 transition-colors">
                  <Td><UserCell user={u} /></Td>
                  <Td><RoleBadge role={u.role} /></Td>
                  <Td>
                    {assigned.length === 0 ? (
                      <span className="text-xs text-act-beige3">Sin asignaciones</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assigned.map(a => {
                          const title = courseTitle(a.course_id)
                          return (
                            <span key={a.course_id} className="text-[11px] bg-act-beige1 border border-act-beige2 px-2 py-0.5 text-act-black/70" style={{ borderRadius: '2px' }}>
                              {title.length > 22 ? title.slice(0, 22) + '…' : title}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </Td>
                  <Td><ProgressBar pct={userAvgPct(u.id, progress)} /></Td>
                  <Td>
                    <button onClick={() => onManageUser(u.id)}
                      className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg hover:text-white transition-colors"
                      style={{ borderRadius: '2px' }}
                    >Gestionar</button>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Section: Catálogo ─────────────────────────────────────────────────────────

function Catalogo({ data }) {
  const { progress } = data
  return (
    <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
      <table className="w-full min-w-[600px]">
        <thead className="bg-act-beige1">
          <tr><Th>Curso</Th><Th>Tipo</Th><Th>Estado</Th><Th>Inscritos</Th><Th>Progreso medio</Th></tr>
        </thead>
        <tbody>
          {catalogData.map(course => {
            const entries = progress.filter(p => p.course_id === course.id)
            const enrolled = new Set(entries.map(p => p.user_id)).size
            const pcts = entries.map(p => progressPct(p, course.id))
            const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0
            return (
              <tr key={course.id} className="hover:bg-act-beige1/30 transition-colors">
                <Td>
                  <div className="font-medium text-act-black">{course.title}</div>
                  <div className="text-xs text-act-beige3 mt-0.5">{course.duration} · {course.modules} módulos</div>
                </Td>
                <Td>
                  <span className={`text-[11px] font-medium px-2 py-0.5 border ${
                    course.type === 'internal'
                      ? 'border-act-black/20 text-act-black bg-act-black/5'
                      : 'border-act-burg/25 text-act-burg bg-act-burg/5'
                  }`} style={{ borderRadius: '2px' }}>
                    {course.type === 'internal' ? 'Interno' : 'Publico'}
                  </span>
                </Td>
                <Td>
                  <span className={`text-[11px] font-medium px-2 py-0.5 border ${
                    course.status === 'published'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-act-beige3 bg-act-beige1 border-act-beige2'
                  }`} style={{ borderRadius: '2px' }}>
                    {course.status === 'published' ? 'Publicado' : 'Proximo'}
                  </span>
                </Td>
                <Td>{enrolled}</Td>
                <Td>{enrolled > 0 ? <ProgressBar pct={avg} /> : <span className="text-xs text-act-beige3">—</span>}</Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Section: Asignar Cursos ───────────────────────────────────────────────────

function UserSearchDropdown({ users, onSelect }) {
  const [search, setSearch]   = useState('')
  const [isOpen, setIsOpen]   = useState(false)
  const wrapperRef            = useRef(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sorted = useMemo(() =>
    [...users].sort((a, b) => {
      const nameA = (a.name ?? a.email ?? '').toLowerCase()
      const nameB = (b.name ?? b.email ?? '').toLowerCase()
      return nameA.localeCompare(nameB)
    }), [users])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q
      ? sorted.filter(u =>
          (u.name ?? '').toLowerCase().includes(q) ||
          (u.email ?? '').toLowerCase().includes(q)
        )
      : sorted
  }, [sorted, search])

  const handleSelect = (u) => {
    onSelect(u.id)
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Buscar usuario..."
        className="w-full border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
        style={{ borderRadius: '2px' }}
      />
      {isOpen && visible.length > 0 && (
        <div
          className="absolute z-20 left-0 right-0 bg-act-white border border-act-beige2 mt-px overflow-y-auto"
          style={{ borderRadius: '2px', maxHeight: '260px', boxShadow: '0 4px 16px rgba(30,29,22,0.10)' }}
        >
          {visible.map(u => {
            const initial   = (u.name ?? u.email ?? '?')[0].toUpperCase()
            const display   = u.name || u.email?.split('@')[0] || '—'
            return (
              <button
                key={u.id}
                onMouseDown={e => { e.preventDefault(); handleSelect(u) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-act-beige1"
              >
                {/* Avatar */}
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={display}
                    className="w-8 h-8 flex-shrink-0 object-cover"
                    style={{ borderRadius: '50%', border: '1px solid #D9C9B8' }}
                  />
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 bg-act-beige1 flex items-center justify-center font-display font-semibold text-sm text-act-black"
                    style={{ borderRadius: '50%', border: '1px solid #D9C9B8' }}
                  >
                    {initial}
                  </div>
                )}
                {/* Nombre + email */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-act-black truncate">{display}</div>
                  <div className="text-xs text-act-beige3 truncate">{u.email}</div>
                </div>
                {/* Badge rol */}
                <RoleBadge role={u.role} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Asignar({ data, adminId, onRefresh, initialUserId }) {
  const { users, assignments } = data
  const [selectedId, setSelectedId]     = useState(initialUserId ?? '')
  const [addCourseId, setAddCourseId]   = useState('')
  const [bulkCourseId, setBulkCourseId] = useState('')
  const [loading, setLoading]           = useState(false)
  const [fb, setFb]                     = useState(null)

  useEffect(() => { if (initialUserId) setSelectedId(initialUserId) }, [initialUserId])

  const msg = (type, text) => { setFb({ type, text }); setTimeout(() => setFb(null), 4000) }

  const selectedUser    = users.find(u => u.id === selectedId)
  const userAssignments = assignments.filter(a => a.user_id === selectedId)
  const availableCourses = catalogData.filter(c => !userAssignments.some(a => a.course_id === c.id))
  const activumUsers    = users.filter(u => u.role === 'activum' || u.email?.includes('@activum.es'))

  const handleRemove = async (courseId) => {
    setLoading(true)
    const { error } = await supabase.from('course_assignments')
      .delete().eq('user_id', selectedId).eq('course_id', courseId)
    setLoading(false)
    if (error) { msg('error', error.message); return }
    onRefresh(); msg('success', 'Curso eliminado de las asignaciones.')
  }

  const handleAdd = async () => {
    if (!addCourseId || !selectedId) return
    setLoading(true)
    const { error } = await supabase.from('course_assignments')
      .upsert({ user_id: selectedId, course_id: addCourseId, assigned_by: adminId }, { onConflict: 'user_id,course_id' })
    setLoading(false)
    if (error) { msg('error', error.message); return }
    setAddCourseId(''); onRefresh(); msg('success', 'Curso asignado correctamente.')
  }

  const handleBulkAssign = async () => {
    if (!bulkCourseId || activumUsers.length === 0) return
    setLoading(true)
    const toAssign = activumUsers
      .filter(u => !assignments.some(a => a.user_id === u.id && a.course_id === bulkCourseId))
      .map(u => ({ user_id: u.id, course_id: bulkCourseId, assigned_by: adminId }))
    if (toAssign.length === 0) {
      setLoading(false); msg('info', 'Todos los usuarios ya tienen este curso asignado.'); return
    }
    const { error } = await supabase.from('course_assignments')
      .upsert(toAssign, { onConflict: 'user_id,course_id' })
    setLoading(false)
    if (error) { msg('error', error.message); return }
    setBulkCourseId(''); onRefresh()
    msg('success', `Curso asignado a ${toAssign.length} usuario${toAssign.length !== 1 ? 's' : ''} del equipo.`)
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {fb && <Alert type={fb.type}>{fb.text}</Alert>}

      {/* Buscar usuario */}
      <div>
        <SecTitle>Seleccionar usuario</SecTitle>
        <UserSearchDropdown users={users} onSelect={setSelectedId} />

        {selectedUser && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-act-beige1 border border-act-beige2" style={{ borderRadius: '2px' }}>
            <UserCell user={selectedUser} />
            <span className="ml-2"><RoleBadge role={selectedUser.role} /></span>
            <button onClick={() => setSelectedId('')} className="ml-auto text-act-beige3 hover:text-act-black text-sm leading-none">×</button>
          </div>
        )}
      </div>

      {/* Cursos asignados al usuario */}
      {selectedId && (
        <div>
          <SecTitle>Cursos de {selectedUser?.name?.split(' ')[0] ?? 'este usuario'}</SecTitle>
          {userAssignments.length === 0 ? (
            <p className="text-sm text-act-beige3 mb-4">Sin cursos asignados.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {userAssignments.map(a => {
                const c = catalogData.find(x => x.id === a.course_id)
                return (
                  <div key={a.course_id} className="flex items-center justify-between border border-act-beige2 px-4 py-3 bg-act-white" style={{ borderRadius: '2px' }}>
                    <div>
                      <div className="text-sm font-medium text-act-black">{c?.title ?? a.course_id}</div>
                      <div className="text-xs text-act-beige3 mt-0.5">{c?.category} · {c?.duration}</div>
                    </div>
                    <button onClick={() => handleRemove(a.course_id)} disabled={loading}
                      className="text-xs text-act-beige3 border border-act-beige2 px-3 py-1.5 hover:border-act-burg hover:text-act-burg transition-colors disabled:opacity-50"
                      style={{ borderRadius: '2px' }}
                    >Quitar ×</button>
                  </div>
                )
              })}
            </div>
          )}
          <div className="flex gap-2">
            <select value={addCourseId} onChange={e => setAddCourseId(e.target.value)}
              className="flex-1 border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg text-act-black/70"
              style={{ borderRadius: '2px' }}
            >
              <option value="">Añadir curso...</option>
              {availableCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title} {c.type === 'internal' ? '(Interno)' : ''}</option>
              ))}
            </select>
            <button onClick={handleAdd} disabled={!addCourseId || loading}
              className="bg-act-burg text-white px-5 py-2.5 text-sm font-medium hover:bg-act-burg-l transition-colors disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >Asignar</button>
          </div>
        </div>
      )}

      {/* Asignación masiva */}
      <div className="border-t border-act-beige1 pt-8">
        <SecTitle>Asignación masiva</SecTitle>
        <p className="text-sm text-act-beige3 mb-4">
          Asigna un curso a todos los usuarios con rol <span className="font-medium text-act-black">activum</span> de una vez
          {activumUsers.length > 0 && <span className="text-act-beige3"> ({activumUsers.length} usuarios)</span>}.
        </p>
        <div className="flex gap-2">
          <select value={bulkCourseId} onChange={e => setBulkCourseId(e.target.value)}
            className="flex-1 border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg text-act-black/70"
            style={{ borderRadius: '2px' }}
          >
            <option value="">Seleccionar curso...</option>
            {catalogData.map(c => (
              <option key={c.id} value={c.id}>{c.title} {c.type === 'internal' ? '(Interno)' : '(Publico)'}</option>
            ))}
          </select>
          <button onClick={handleBulkAssign} disabled={!bulkCourseId || loading || activumUsers.length === 0}
            className="border border-act-black text-act-black px-5 py-2.5 text-sm font-medium hover:bg-act-black hover:text-white transition-colors disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          >
            {loading ? 'Asignando...' : `Asignar a ${activumUsers.length}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const ADMIN_NAV = [
  { id: 'resumen',   label: 'Resumen' },
  { id: 'usuarios',  label: 'Todos los usuarios' },
  { id: 'equipo',    label: 'Equipo Activum' },
  { id: 'catalogo',  label: 'Catálogo' },
  { id: 'asignar',   label: 'Asignar cursos' },
]

// ── AdminPanel ────────────────────────────────────────────────────────────────

export default function AdminPanel({ user }) {
  const [section, setSection]         = useState('resumen')
  const [managingUserId, setManaging] = useState(null)
  const [adminData, setAdminData]     = useState({ users: [], assignments: [], progress: [], loading: true })

  const loadAdminData = async () => {
    const [uRes, aRes, pRes, cntRes] = await Promise.all([
      supabase.from('profiles').select('*').order('email'),
      supabase.from('course_assignments').select('*'),
      supabase.from('progress').select('user_id, course_id, progress, updated_at').order('updated_at', { ascending: false }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])
    if (uRes.error)   console.error('[admin] error cargando profiles:', uRes.error.message)
    if (aRes.error)   console.error('[admin] error cargando assignments:', aRes.error.message)
    if (pRes.error)   console.error('[admin] error cargando progress:', pRes.error.message)
    if (cntRes.error) console.error('[admin] error count profiles:', cntRes.error.message)
    console.log('[admin] usuarios cargados:', uRes.data)
    console.log('[admin] count exacto:', cntRes.count)
    setAdminData({
      users:       uRes.data  ?? [],
      assignments: aRes.data  ?? [],
      progress:    pRes.data  ?? [],
      totalCount:  cntRes.count ?? uRes.data?.length ?? 0,
      loading:     false,
    })
  }

  useEffect(() => { loadAdminData() }, [])

  const handleChangeRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!error) setAdminData(d => ({ ...d, users: d.users.map(u => u.id === userId ? { ...u, role: newRole } : u) }))
  }

  const handleManageUser = (userId) => { setManaging(userId); setSection('asignar') }

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex border-b border-act-beige2 mb-8 overflow-x-auto">
        {ADMIN_NAV.map(n => (
          <button key={n.id} onClick={() => setSection(n.id)}
            className={`px-5 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              section === n.id
                ? 'border-act-burg text-act-burg'
                : 'border-transparent text-act-beige3 hover:text-act-black hover:border-act-beige2'
            }`}
          >{n.label}</button>
        ))}
      </div>

      {/* Content */}
      {adminData.loading ? (
        <div className="flex items-center gap-3 py-16 text-act-beige3">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="text-sm">Cargando datos...</span>
        </div>
      ) : (
        <>
          {section === 'resumen'  && <Resumen  data={adminData} />}
          {section === 'usuarios' && <Usuarios data={adminData} onChangeRole={handleChangeRole} onManageUser={handleManageUser} />}
          {section === 'equipo'   && <Equipo   data={adminData} onManageUser={handleManageUser} />}
          {section === 'catalogo' && <Catalogo data={adminData} />}
          {section === 'asignar'  && <Asignar  data={adminData} adminId={user?.userId} onRefresh={loadAdminData} initialUserId={managingUserId} />}
        </>
      )}
    </div>
  )
}
