import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '../../supabase'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function RoleBadge({ role }) {
  const styles = {
    admin:   { background: '#8C1736', color: '#fff' },
    activum: { background: '#1E1D16', color: '#fff' },
    user:    { background: 'transparent', color: '#C4B09A', border: '1px solid #D9C9B8' },
  }
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 tracking-wide" style={{ borderRadius: '2px', ...(styles[role] ?? styles.user) }}>
      {role ?? 'user'}
    </span>
  )
}

function Avatar({ user, size = 32 }) {
  const initial = (user?.name ?? user?.email ?? '?')[0].toUpperCase()
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={initial} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid #D9C9B8', flexShrink: 0 }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#EDE3D8', border: '1px solid #D9C9B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: Math.round(size * 0.4), color: '#1E1D16', lineHeight: 1 }}>{initial}</span>
    </div>
  )
}

// ── Modal detalle usuario ─────────────────────────────────────────────────────

function UserModal({ user, assignments, progress, onClose, onRoleChange }) {
  const [newRole, setNewRole]     = useState(user.role ?? 'user')
  const [saving, setSaving]       = useState(false)
  const [confirm, setConfirm]     = useState(false)

  const userProgress = progress.filter(p => p.user_id === user.id)
  const userAssigns  = assignments.filter(a => a.user_id === user.id)

  const handleRoleChange = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    setSaving(false)
    if (!error) { onRoleChange(user.id, newRole); setConfirm(false) }
  }

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

          {/* Cambiar rol */}
          <div>
            <div className="text-xs text-act-beige3 mb-2 tracking-widest uppercase">Cambiar rol</div>
            <div className="flex gap-2">
              <select
                value={newRole}
                onChange={e => { setNewRole(e.target.value); setConfirm(false) }}
                className="flex-1 border border-act-beige2 bg-act-white text-sm px-3 py-2 focus:outline-none focus:border-act-burg text-act-black"
                style={{ borderRadius: '2px' }}
              >
                <option value="user">user</option>
                <option value="activum">activum</option>
                <option value="admin">admin</option>
              </select>
              {newRole !== user.role && !confirm && (
                <button onClick={() => setConfirm(true)}
                  className="border border-act-burg text-act-burg px-4 py-2 text-xs font-medium hover:bg-act-burg hover:text-white transition-colors"
                  style={{ borderRadius: '2px' }}
                >Cambiar</button>
              )}
              {confirm && (
                <button onClick={handleRoleChange} disabled={saving}
                  className="bg-act-burg text-white px-4 py-2 text-xs font-medium hover:bg-act-burg-l transition-colors disabled:opacity-50"
                  style={{ borderRadius: '2px' }}
                >{saving ? 'Guardando…' : 'Confirmar'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Users page ────────────────────────────────────────────────────────────────

export default function Users() {
  const [users,       setUsers]       = useState([])
  const [assignments, setAssignments] = useState([])
  const [progress,    setProgress]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState(null)

  useEffect(() => {
    async function load() {
      const [uRes, aRes, pRes] = await Promise.all([
        supabase.from('profiles').select('*').order('email'),
        supabase.from('course_assignments').select('*'),
        supabase.from('progress').select('user_id, course_id, progress, updated_at'),
      ])
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
              const assigns  = assignments.filter(a => a.user_id === u.id).length
              const lessons  = progress.filter(p => p.user_id === u.id)
                .reduce((s, p) => s + (p.progress?.completedLessons?.length ?? 0), 0)
              const display  = u.name || u.email?.split('@')[0] || '—'
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
                  <td className="py-3 px-4 border-b border-act-beige1"><RoleBadge role={u.role} /></td>
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
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  )
}
