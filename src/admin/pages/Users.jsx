import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '../../supabase'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ROLE_LABELS = { admin: 'Administrador', activum: 'Equipo Activum', user: 'Usuario' }

const ROLE_BADGE_STYLE = {
  admin:   { background: '#8C1736', color: '#fff',     border: 'none' },
  activum: { background: '#1E1D16', color: '#F7F2EA',  border: 'none' },
  user:    { background: '#EDE3D8', color: '#888780',  border: '1px solid #D9C9B8' },
}

function RoleBadge({ role }) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 tracking-wide" style={{ borderRadius: '2px', ...(ROLE_BADGE_STYLE[role] ?? ROLE_BADGE_STYLE.user) }}>
      {role ?? 'user'}
    </span>
  )
}

// ── Inline role dropdown ───────────────────────────────────────────────────────

function RoleDropdownBadge({ user, currentUserId, onRoleChange }) {
  const [open,     setOpen]     = useState(false)
  const [pending,  setPending]  = useState(null)   // rol seleccionado pendiente de confirmar
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState(null)   // { type: 'ok'|'err', text }
  const ref = useRef(null)

  // Cerrar al clicar fuera
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setPending(null) } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (role) => {
    if (role === (user.role ?? 'user')) { setOpen(false); return }
    if (user.id === currentUserId && role !== 'admin') {
      setFeedback({ type: 'err', text: 'No puedes cambiar tu propio rol de admin' })
      setOpen(false)
      setTimeout(() => setFeedback(null), 3500)
      return
    }
    setPending(role)
  }

  const handleConfirm = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ role: pending }).eq('id', user.id)
    setSaving(false)
    if (error) {
      setFeedback({ type: 'err', text: 'Error al actualizar el rol' })
    } else {
      onRoleChange(user.id, pending)
      setFeedback({ type: 'ok', text: 'Rol actualizado correctamente' })
    }
    setOpen(false)
    setPending(null)
    setTimeout(() => setFeedback(null), 3000)
  }

  const currentRole = user.role ?? 'user'

  return (
    <div ref={ref} className="relative inline-block">
      {/* Badge clicable */}
      <button
        onClick={() => { setOpen(o => !o); setPending(null) }}
        className="flex items-center gap-1 group"
        title="Cambiar rol"
      >
        <span className="text-[11px] font-medium px-2 py-0.5 tracking-wide transition-opacity group-hover:opacity-75"
          style={{ borderRadius: '2px', ...(ROLE_BADGE_STYLE[currentRole] ?? ROLE_BADGE_STYLE.user) }}>
          {currentRole}
        </span>
        <svg className="w-2.5 h-2.5 text-act-beige3 group-hover:text-act-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Feedback inline */}
      {feedback && (
        <div className={`absolute left-0 top-7 z-30 whitespace-nowrap text-[11px] px-2.5 py-1.5 font-medium ${
          feedback.type === 'ok'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-act-burg border border-red-100'
        }`} style={{ borderRadius: '2px' }}>
          {feedback.text}
        </div>
      )}

      {/* Dropdown */}
      {open && !feedback && (
        <div className="absolute left-0 top-7 z-30 w-48 border border-act-beige2 shadow-card"
          style={{ background: '#F7F2EA', borderRadius: '2px' }}>

          {pending ? (
            /* Confirmación */
            <div className="p-3 space-y-2">
              <p className="text-xs text-act-black leading-snug">
                ¿Cambiar rol de <strong>{user.name || user.email?.split('@')[0]}</strong> a <strong>{ROLE_LABELS[pending]}</strong>?
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={handleConfirm}
                  disabled={saving}
                  className="flex-1 text-[11px] font-medium bg-act-burg text-white py-1.5 hover:bg-act-burg-l transition-colors disabled:opacity-50"
                  style={{ borderRadius: '2px' }}
                >
                  {saving ? 'Guardando…' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setPending(null)}
                  className="flex-1 text-[11px] border border-act-beige2 text-act-beige3 py-1.5 hover:border-act-beige3 hover:text-act-black transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            /* Lista de roles */
            <ul className="py-1">
              {['user', 'activum', 'admin'].map(role => (
                <li key={role}>
                  <button
                    onClick={() => handleSelect(role)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-act-black text-left transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EDE3D8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Punto activo */}
                    <span className="w-3 flex-shrink-0 flex items-center justify-center">
                      {role === currentRole && (
                        <span className="w-1.5 h-1.5 rounded-full bg-act-burg" />
                      )}
                    </span>
                    <RoleBadge role={role} />
                    <span className="text-act-beige3">{ROLE_LABELS[role]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ── Modal detalle usuario ─────────────────────────────────────────────────────

function UserModal({ user, assignments, progress, onClose }) {
  const userProgress = progress.filter(p => p.user_id === user.id)
  const userAssigns  = assignments.filter(a => a.user_id === user.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,29,22,0.5)' }} onClick={onClose}>
      <div className="bg-act-white border border-act-beige2 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ borderRadius: '2px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-act-beige2">
          <Avatar user={user} size={48} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-act-black truncate">{user.name || user.email?.split('@')[0]}</div>
            <div className="text-xs text-act-beige3 truncate">{user.email}</div>
            <div className="mt-1.5"><RoleBadge role={user.role} /></div>
          </div>
          <button onClick={onClose} className="text-act-beige3 hover:text-act-black text-xl leading-none flex-shrink-0">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-act-beige3 mb-1">Registrado</div>
              <div className="text-act-black">{fmt(user.created_at)}</div>
            </div>
            <div>
              <div className="text-xs text-act-beige3 mb-1">Cursos asignados</div>
              <div className="text-act-black">{userAssigns.length}</div>
            </div>
          </div>

          {/* Progreso por curso */}
          {userProgress.length > 0 && (
            <div>
              <div className="text-xs text-act-beige3 mb-2 tracking-widest uppercase">Progreso por curso</div>
              <div className="space-y-2">
                {userProgress.map(p => (
                  <div key={p.course_id} className="flex items-center justify-between text-sm border border-act-beige1 px-3 py-2" style={{ borderRadius: '2px' }}>
                    <span className="text-act-black/70 truncate flex-1 mr-4">{p.course_id}</span>
                    <span className="text-act-burg font-medium text-xs">{p.progress?.completedLessons?.length ?? 0} lec.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Avatar({ user, size = 32 }) {
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={initial} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid #D9C9B8', flexShrink: 0 }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#EDE3D8', border: '1px solid #D9C9B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'Roboto Serif, serif', fontWeight: 600, fontSize: Math.round(size * 0.4), color: '#1E1D16', lineHeight: 1 }}>{initial}</span>
    </div>
  )
}

// ── SortableHeader ────────────────────────────────────────────────────────────

function SortableHeader({ label, field, sortField, sortDir, onSort, className = '' }) {
  const active = sortField === field
  return (
    <th
      className={`text-left text-[11px] font-medium tracking-widest uppercase py-3 px-4 border-b border-act-beige2 cursor-pointer select-none whitespace-nowrap group ${className}`}
      onClick={() => onSort(field)}
    >
      <span className={`flex items-center gap-1 ${active ? 'text-act-burg' : 'text-act-beige3'}`}>
        {label}
        <span className="w-3 flex-shrink-0">
          {active ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {sortDir === 'asc'
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />}
            </svg>
          ) : (
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9" />
            </svg>
          )}
        </span>
      </span>
    </th>
  )
}

// ── Users page ────────────────────────────────────────────────────────────────

export default function Users() {
  const [users,         setUsers]         = useState([])
  const [assignments,   setAssignments]   = useState([])
  const [progress,      setProgress]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [selected,      setSelected]      = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [sortField,     setSortField]     = useState('name')
  const [sortDir,       setSortDir]       = useState('asc')
  const [roleFilter,    setRoleFilter]    = useState('all')

  useEffect(() => {
    async function load() {
      const [{ data: { user } }, uRes, aRes, pRes] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('profiles').select('*').order('email'),
        supabase.from('course_assignments').select('*'),
        supabase.from('progress').select('user_id, course_id, progress, updated_at'),
      ])
      setCurrentUserId(user?.id ?? null)
      setUsers(uRes.data ?? [])
      setAssignments(aRes.data ?? [])
      setProgress(pRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    // Filtrar por texto y rol
    let result = users.filter(u => {
      const matchText = !q ||
        (u.name ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || (u.role ?? 'user') === roleFilter
      return matchText && matchRole
    })

    // Enriquecer con valores calculados para poder ordenar
    result = result.map(u => {
      const userProgress      = progress.filter(p => p.user_id === u.id)
      const assigns           = assignments.filter(a => a.user_id === u.id).length
      const coursesInProgress = userProgress.filter(p => (p.progress?.completedLessons?.length ?? 0) > 0).length
      const lessons           = userProgress.reduce((s, p) => s + (p.progress?.completedLessons?.length ?? 0), 0)
      return { ...u, _assigns: assigns, _inProgress: coursesInProgress, _lessons: lessons }
    })

    // Ordenar
    result.sort((a, b) => {
      let va, vb
      switch (sortField) {
        case 'name':       va = (a.name || a.email || '').toLowerCase(); vb = (b.name || b.email || '').toLowerCase(); break
        case 'role':       va = a.role ?? 'user';      vb = b.role ?? 'user';      break
        case 'assigns':    va = a._assigns;             vb = b._assigns;            break
        case 'inProgress': va = a._inProgress;          vb = b._inProgress;         break
        case 'lessons':    va = a._lessons;             vb = b._lessons;            break
        case 'created_at': va = a.created_at ?? '';     vb = b.created_at ?? '';    break
        default:           va = ''; vb = ''
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })

    return result
  }, [users, search, roleFilter, assignments, progress, sortField, sortDir])

  const [deleteTarget, setDeleteTarget] = useState(null)  // user a eliminar
  const [deleting,     setDeleting]     = useState(false)
  const [deleteError,  setDeleteError]  = useState(null)

  const handleRoleChange = (userId, newRole) => {
    setUsers(us => us.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setSelected(s => s?.id === userId ? { ...s, role: newRole } : s)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: deleteTarget.id })
    setDeleting(false)
    if (error) {
      setDeleteError(error.message)
    } else {
      setUsers(us => us.filter(u => u.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando usuarios...</span>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Usuarios</h1>
          <p className="text-sm text-act-beige3">{users.length} usuarios registrados</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filtro por rol */}
          {[
            { id: 'all',     label: 'Todos' },
            { id: 'admin',   label: 'Admin' },
            { id: 'activum', label: 'Activum' },
            { id: 'user',    label: 'Usuario' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRoleFilter(id)}
              className={`text-xs px-3 py-2 border font-medium transition-colors ${
                roleFilter === id
                  ? 'bg-act-burg text-white border-act-burg'
                  : 'bg-act-white text-act-black/60 border-act-beige2 hover:border-act-burg/40 hover:text-act-burg'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {label}
              <span className={`ml-1.5 text-[10px] ${roleFilter === id ? 'opacity-70' : 'text-act-beige3'}`}>
                {id === 'all' ? users.length : users.filter(u => (u.role ?? 'user') === id).length}
              </span>
            </button>
          ))}
          {/* Búsqueda */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-48 border border-act-beige2 bg-act-white px-4 py-2 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
            style={{ borderRadius: '2px' }}
          />
        </div>
      </div>

      <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
        <table className="w-full min-w-[680px]">
          <thead className="bg-act-beige1">
            <tr>
              <SortableHeader label="Usuario"           field="name"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Rol"               field="role"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Asignados"         field="assigns"    sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="En progreso"       field="inProgress" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Lecciones"         field="lessons"    sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Registrado"        field="created_at" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <th className="py-3 px-4 border-b border-act-beige2" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-act-beige3">Sin resultados</td></tr>
            ) : filtered.map(u => {
              const display = u.name || u.email?.split('@')[0] || '—'
              return (
                <tr key={u.id} className="hover:bg-act-beige1/40 transition-colors">
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <div className="flex items-center gap-2.5">
                      <Avatar user={u} size={30} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-act-black truncate">{display}</div>
                        <div className="text-xs text-act-beige3 truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <RoleDropdownBadge
                      user={u}
                      currentUserId={currentUserId}
                      onRoleChange={handleRoleChange}
                    />
                  </td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{u._assigns}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{u._inProgress}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{u._lessons}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-xs text-act-beige3">{fmt(u.created_at)}</td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(u)}
                        className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg hover:text-white transition-colors"
                        style={{ borderRadius: '2px' }}
                      >Ver detalle</button>
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => { setDeleteTarget(u); setDeleteError(null) }}
                          className="text-xs text-act-beige3 border border-act-beige2 px-2 py-1.5 hover:border-red-300 hover:text-red-500 transition-colors"
                          style={{ borderRadius: '2px' }}
                          title="Eliminar cuenta"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-act-beige3">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</p>

      {selected && (
        <UserModal
          user={selected}
          assignments={assignments}
          progress={progress}
          onClose={() => setSelected(null)}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,29,22,0.5)' }}
          onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="bg-act-white border border-act-beige2 w-full max-w-sm p-6 space-y-4" style={{ borderRadius: '2px' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-red-200 bg-red-50" style={{ borderRadius: '2px' }}>
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-act-black text-sm">Eliminar cuenta</h3>
                <p className="text-xs text-act-beige3 mt-1 leading-relaxed">
                  ¿Eliminar la cuenta de <strong className="text-act-black">{deleteTarget.name || deleteTarget.email?.split('@')[0]}</strong>?
                  Esta acción es irreversible — se borrarán todos sus datos, progreso y asignaciones.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2" style={{ borderRadius: '2px' }}>
                {deleteError}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="text-xs border border-act-beige2 text-act-beige3 px-4 py-2 hover:border-act-beige3 hover:text-act-black transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >Cancelar</button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="text-xs bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {deleting ? 'Eliminando…' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
