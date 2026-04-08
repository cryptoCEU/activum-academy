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
  const initial = (user?.name ?? user?.email ?? '?')[0].toUpperCase()
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={initial} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid #D9C9B8', flexShrink: 0 }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#EDE3D8', border: '1px solid #D9C9B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'Roboto Serif, serif', fontWeight: 600, fontSize: Math.round(size * 0.4), color: '#1E1D16', lineHeight: 1 }}>{initial}</span>
    </div>
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    )
  }, [users, search])

  const handleRoleChange = (userId, newRole) => {
    setUsers(us => us.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setSelected(s => s?.id === userId ? { ...s, role: newRole } : s)
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
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-64 border border-act-beige2 bg-act-white px-4 py-2 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
          style={{ borderRadius: '2px' }}
        />
      </div>

      <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
        <table className="w-full min-w-[680px]">
          <thead className="bg-act-beige1">
            <tr>
              {['Usuario', 'Rol', 'Cursos asignados', 'Progreso', 'Registrado', ''].map(h => (
                <th key={h} className="text-left text-[11px] font-medium text-act-beige3 tracking-widest uppercase py-3 px-4 border-b border-act-beige2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-act-beige3">Sin resultados</td></tr>
            ) : filtered.map(u => {
              const assigns = assignments.filter(a => a.user_id === u.id).length
              const lessons = progress.filter(p => p.user_id === u.id)
                .reduce((s, p) => s + (p.progress?.completedLessons?.length ?? 0), 0)
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
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{assigns}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{lessons} lec.</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-xs text-act-beige3">{fmt(u.created_at)}</td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <button
                      onClick={() => setSelected(u)}
                      className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg hover:text-white transition-colors"
                      style={{ borderRadius: '2px' }}
                    >Ver detalle</button>
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
    </div>
  )
}
