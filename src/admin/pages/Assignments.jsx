import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '../../supabase'

function RoleBadge({ role }) {
  const styles = {
    admin:   { background: '#8C1736', color: '#fff' },
    activum: { background: '#1E1D16', color: '#fff' },
    user:    { background: 'transparent', color: '#C4B09A', border: '1px solid #D9C9B8' },
  }
  return <span className="text-[11px] font-medium px-2 py-0.5" style={{ borderRadius: '2px', ...(styles[role] ?? styles.user) }}>{role ?? 'user'}</span>
}

function Avatar({ user, size = 28 }) {
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#EDE3D8', border: '1px solid #D9C9B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: Math.round(size * 0.4), color: '#1E1D16', lineHeight: 1 }}>{initial}</span>
    </div>
  )
}

function UserSearchDropdown({ users, onSelect }) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sorted = useMemo(() => [...users].sort((a, b) =>
    (a.name ?? a.email ?? '').localeCompare(b.name ?? b.email ?? '')
  ), [users])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? sorted.filter(u => (u.name ?? '').toLowerCase().includes(q) || (u.email ?? '').toLowerCase().includes(q)) : sorted
  }, [sorted, search])

  return (
    <div ref={ref} className="relative">
      <input
        type="text" value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Buscar usuario..."
        className="w-full border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
        style={{ borderRadius: '2px' }}
      />
      {isOpen && visible.length > 0 && (
        <div className="absolute z-20 left-0 right-0 bg-act-white border border-act-beige2 mt-px overflow-y-auto"
          style={{ borderRadius: '2px', maxHeight: '240px', boxShadow: '0 4px 16px rgba(30,29,22,0.10)' }}>
          {visible.map(u => (
            <button key={u.id}
              onMouseDown={e => { e.preventDefault(); onSelect(u.id); setSearch(''); setIsOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-act-beige1 transition-colors"
            >
              <Avatar user={u} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-act-black truncate">{u.name || u.email?.split('@')[0]}</div>
                <div className="text-xs text-act-beige3 truncate">{u.email}</div>
              </div>
              <RoleBadge role={u.role} />
            </button>
          ))}
        </div>
      )}
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

export default function Assignments() {
  const [users,       setUsers]       = useState([])
  const [courses,     setCourses]     = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedId,  setSelectedId]  = useState('')
  const [addCourseId, setAddCourseId] = useState('')
  const [bulkCourseId,setBulkCourseId]= useState('')
  const [busy,        setBusy]        = useState(false)
  const [fb,          setFb]          = useState(null)

  const msg = (type, text) => { setFb({ type, text }); setTimeout(() => setFb(null), 4000) }

  const loadData = async () => {
    const [uRes, cRes, aRes] = await Promise.all([
      supabase.from('profiles').select('*').order('email'),
      supabase.from('courses').select('id, title, type, status').order('title'),
      supabase.from('course_assignments').select('*'),
    ])
    setUsers(uRes.data ?? [])
    setCourses(cRes.data ?? [])
    setAssignments(aRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const selectedUser    = users.find(u => u.id === selectedId)
  const userAssignments = assignments.filter(a => a.user_id === selectedId)
  const availableCourses= courses.filter(c => !userAssignments.some(a => a.course_id === c.id))
  const activumUsers    = users.filter(u => u.role === 'activum' || u.email?.includes('@activum.es'))

  const handleRemove = async (courseId) => {
    setBusy(true)
    const { error } = await supabase.from('course_assignments').delete().eq('user_id', selectedId).eq('course_id', courseId)
    setBusy(false)
    if (error) { msg('error', error.message); return }
    setAssignments(as => as.filter(a => !(a.user_id === selectedId && a.course_id === courseId)))
    msg('success', 'Curso eliminado.')
  }

  const handleAdd = async () => {
    if (!addCourseId || !selectedId) return
    setBusy(true)
    const { data, error } = await supabase.from('course_assignments')
      .upsert({ user_id: selectedId, course_id: addCourseId }, { onConflict: 'user_id,course_id' })
      .select()
    setBusy(false)
    if (error) { msg('error', error.message); return }
    setAssignments(as => [...as, ...(data ?? [])])
    setAddCourseId('')
    msg('success', 'Curso asignado.')
  }

  const handleBulkAssign = async () => {
    if (!bulkCourseId || activumUsers.length === 0) return
    setBusy(true)
    const toAssign = activumUsers
      .filter(u => !assignments.some(a => a.user_id === u.id && a.course_id === bulkCourseId))
      .map(u => ({ user_id: u.id, course_id: bulkCourseId }))
    if (toAssign.length === 0) { setBusy(false); msg('info', 'Todos ya tienen este curso.'); return }
    const { data, error } = await supabase.from('course_assignments')
      .upsert(toAssign, { onConflict: 'user_id,course_id' }).select()
    setBusy(false)
    if (error) { msg('error', error.message); return }
    setAssignments(as => [...as, ...(data ?? [])])
    setBulkCourseId('')
    msg('success', `Asignado a ${toAssign.length} usuario${toAssign.length !== 1 ? 's' : ''}.`)
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando...</span>
    </div>
  )

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Asignaciones</h1>
        <p className="text-sm text-act-beige3">Gestiona el acceso de usuarios a cursos internos</p>
      </div>

      {fb && <Alert type={fb.type}>{fb.text}</Alert>}

      {/* Seleccionar usuario */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Seleccionar usuario</span>
        </div>
        <UserSearchDropdown users={users} onSelect={setSelectedId} />
        {selectedUser && (
          <div className="flex items-center gap-3 mt-2 p-3 bg-act-beige1 border border-act-beige2" style={{ borderRadius: '2px' }}>
            <Avatar user={selectedUser} size={32} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-act-black">{selectedUser.name || selectedUser.email?.split('@')[0]}</div>
              <div className="text-xs text-act-beige3">{selectedUser.email}</div>
            </div>
            <RoleBadge role={selectedUser.role} />
            <button onClick={() => setSelectedId('')} className="text-act-beige3 hover:text-act-black text-lg leading-none">×</button>
          </div>
        )}
      </div>

      {/* Cursos asignados al usuario */}
      {selectedId && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-5 bg-act-burg" />
            <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">
              Cursos de {selectedUser?.name?.split(' ')[0] ?? 'este usuario'}
            </span>
          </div>
          {userAssignments.length === 0 ? (
            <p className="text-sm text-act-beige3 mb-3">Sin cursos asignados.</p>
          ) : (
            <div className="space-y-2 mb-3">
              {userAssignments.map(a => {
                const c = courses.find(x => x.id === a.course_id)
                return (
                  <div key={a.course_id} className="flex items-center justify-between border border-act-beige2 px-4 py-3 bg-act-white" style={{ borderRadius: '2px' }}>
                    <div>
                      <div className="text-sm font-medium text-act-black">{c?.title ?? a.course_id}</div>
                      <div className="text-xs text-act-beige3 mt-0.5">{c?.category} · {c?.type === 'internal' ? 'Interno' : 'Público'}</div>
                    </div>
                    <button onClick={() => handleRemove(a.course_id)} disabled={busy}
                      className="text-xs text-act-beige3 border border-act-beige2 px-3 py-1.5 hover:border-act-burg hover:text-act-burg transition-colors disabled:opacity-50"
                      style={{ borderRadius: '2px' }}
                    >Quitar</button>
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
              {availableCourses.map(c => <option key={c.id} value={c.id}>{c.title} {c.type === 'internal' ? '(Interno)' : ''}</option>)}
            </select>
            <button onClick={handleAdd} disabled={!addCourseId || busy}
              className="bg-act-burg text-white px-5 py-2.5 text-sm font-medium hover:bg-act-burg-l transition-colors disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >Asignar</button>
          </div>
        </div>
      )}

      {/* Asignación masiva */}
      <div className="border-t border-act-beige1 pt-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Asignación masiva</span>
        </div>
        <p className="text-sm text-act-beige3 mb-4">
          Asigna un curso a todos los usuarios con rol <strong className="text-act-black font-medium">activum</strong>
          {activumUsers.length > 0 && <span className="text-act-beige3"> ({activumUsers.length} usuarios)</span>}.
        </p>
        <div className="flex gap-2">
          <select value={bulkCourseId} onChange={e => setBulkCourseId(e.target.value)}
            className="flex-1 border border-act-beige2 bg-act-white px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg text-act-black/70"
            style={{ borderRadius: '2px' }}
          >
            <option value="">Seleccionar curso...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.type === 'internal' ? 'Interno' : 'Público'})</option>)}
          </select>
          <button onClick={handleBulkAssign} disabled={!bulkCourseId || busy || activumUsers.length === 0}
            className="border border-act-black text-act-black px-5 py-2.5 text-sm font-medium hover:bg-act-black hover:text-white transition-colors disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          >{busy ? 'Asignando...' : `Asignar a ${activumUsers.length}`}</button>
        </div>
      </div>
    </div>
  )
}
