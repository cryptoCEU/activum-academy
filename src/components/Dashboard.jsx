import { useState, useRef, useEffect } from 'react'
import ActivumLogo from './ActivumLogo'
import { catalogData as defaultCatalog } from '../data/catalogData'
import { updateProfile, updatePassword, sendPasswordReset, deleteAccount, uploadAvatar, deleteAvatar } from '../auth'
import { supabase } from '../supabase'

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconCourses() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}
function IconProfile() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
function IconRanking() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
function IconSecurity() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}
function IconArrow() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}
function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}
function IconCamera() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  )
}

// ── UserAvatar ────────────────────────────────────────────────────────────────

export function UserAvatar({ user, size = 40 }) {
  const fontSize = Math.max(12, Math.round(size * 0.38))
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      flexShrink: 0, boxShadow: '0 0 0 2px #D9C9B8', background: '#EDE3D8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={user?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize, color: '#1E1D16', lineHeight: 1, userSelect: 'none' }}>
          {(user?.name?.[0] ?? '?').toUpperCase()}
        </span>
      )}
    </div>
  )
}

// ── Form helpers ──────────────────────────────────────────────────────────────

function Label({ children }) {
  return <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">{children}</label>
}
function Input({ disabled, ...props }) {
  return (
    <input {...props} disabled={disabled}
      className={`w-full border bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none transition-colors placeholder:text-act-beige3 ${disabled ? 'border-act-beige1 text-act-beige3 cursor-not-allowed' : 'border-act-beige2 focus:border-act-burg'}`}
      style={{ borderRadius: '2px' }}
    />
  )
}
function SaveBtn({ loading, label = 'Guardar cambios' }) {
  return (
    <button type="submit" disabled={loading}
      className="bg-act-burg text-act-white px-6 py-2.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50"
      style={{ borderRadius: '2px' }}
    >{loading ? 'Guardando...' : label}</button>
  )
}
function Alert({ type, children }) {
  const cls = { success: 'text-emerald-700 bg-emerald-50 border-emerald-200', error: 'text-act-burg bg-red-50 border-red-100', info: 'text-act-black/70 bg-act-beige1 border-act-beige2' }[type]
  return <div className={`text-xs border px-3 py-2.5 ${cls}`} style={{ borderRadius: '2px' }}>{children}</div>
}
function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-5 bg-act-burg flex-shrink-0" />
      <h2 className="font-display text-xl font-semibold text-act-black">{children}</h2>
    </div>
  )
}

// ── Section: Mis Cursos ───────────────────────────────────────────────────────

function MisCursos({ catalog, userProgressMap, onEnterCourse }) {
  const published  = catalog.filter(c => c.status === 'published')
  const comingSoon = catalog.filter(c => c.status === 'coming_soon')

  const progressOf = (course) => {
    const p = userProgressMap?.[course.id]
    return p ? Math.round(
      ((p.completedLessons?.length || 0) + Object.keys(p.completedQuizzes || {}).length) /
      ((course.lessons || 1) + (course.modules || 0)) * 100
    ) : 0
  }

  const activeCourses    = published.filter(c => progressOf(c) > 0)
  const availableCourses = published.filter(c => progressOf(c) === 0)
  const totalCompleted   = Object.values(userProgressMap || {}).reduce((s, p) => s + (p?.completedLessons?.length || 0), 0)
  const avgProgress      = published.length ? Math.round(published.reduce((s, c) => s + progressOf(c), 0) / published.length) : 0

  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Resumen</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Cursos activos',       value: activeCourses.length },
            { label: 'Progreso medio',        value: `${avgProgress}%` },
            { label: 'Lecciones completadas', value: totalCompleted },
          ].map(s => (
            <div key={s.label} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
              <div className="font-display text-3xl font-light text-act-black mb-1">{s.value}</div>
              <div className="text-xs text-act-beige3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Cursos en progreso</SectionTitle>
        <div className="space-y-4 mt-4">
          {activeCourses.length === 0 ? (
            <p className="text-sm text-act-beige3">Todavía no has comenzado ningún curso.</p>
          ) : activeCourses.map(course => {
            const pct = progressOf(course)
            return (
              <div key={course.id} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-act-burg border border-act-burg/25 bg-act-burg/5 px-2 py-0.5 font-medium" style={{ borderRadius: '2px' }}>{course.category}</span>
                      <span className="text-xs text-act-beige3">{course.duration}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-act-black leading-snug mb-3">{course.title}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-act-beige2" style={{ borderRadius: '1px' }}>
                        <div className="h-full bg-act-burg transition-all" style={{ width: `${pct}%`, borderRadius: '1px' }} />
                      </div>
                      <span className="text-xs text-act-burg font-medium w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <button onClick={() => onEnterCourse(course.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 border border-act-beige2 text-act-black/70 px-4 py-2 text-xs font-medium hover:border-act-burg hover:text-act-burg transition-colors"
                    style={{ borderRadius: '2px' }}
                  >{pct > 0 ? 'Continuar' : 'Comenzar'}<IconArrow /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {availableCourses.length > 0 && (
        <div>
          <SectionTitle>Cursos disponibles</SectionTitle>
          <div className="space-y-3 mt-4">
            {availableCourses.map(course => (
              <div key={course.id} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-act-beige3 mb-1">{course.category} · {course.duration}</div>
                    <h3 className="font-display text-base font-semibold text-act-black">{course.title}</h3>
                  </div>
                  <button onClick={() => onEnterCourse(course.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 border border-act-beige2 text-act-black/70 px-4 py-2 text-xs font-medium hover:border-act-burg hover:text-act-burg transition-colors"
                    style={{ borderRadius: '2px' }}>
                    Comenzar <IconArrow />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section: Mi Perfil ────────────────────────────────────────────────────────

const MAX_SIZE_MB = 2
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function MiPerfil({ user, onUserUpdate }) {
  const fileRef = useRef(null)
  const [preview, setPreview]         = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarFeedback, setAvatarFeedback] = useState(null)
  const [form, setForm]     = useState({ name: user?.name ?? '', empresa: user?.empresa ?? '', bio: '' })
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied]     = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setFeedback(null) }

  // Load bio from profiles table on mount
  useEffect(() => {
    if (!user?.userId) return
    supabase.from('profiles').select('bio').eq('id', user.userId).single()
      .then(({ data }) => { if (data?.bio) setForm(f => ({ ...f, bio: data.bio ?? '' })) })
  }, [user?.userId])

  const profileUrl = `${window.location.origin}/u/${user?.userId}`
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (!ALLOWED_TYPES.includes(file.type)) { setAvatarFeedback({ type: 'error', msg: 'Formato no válido. Usa JPG, PNG o WebP.' }); return }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { setAvatarFeedback({ type: 'error', msg: `La imagen supera el límite de ${MAX_SIZE_MB}MB.` }); return }
    setAvatarFeedback(null); setPendingFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!pendingFile) return
    setAvatarLoading(true); setAvatarFeedback(null)
    const result = await uploadAvatar(user.userId, pendingFile)
    setAvatarLoading(false)
    if (result.error) { setAvatarFeedback({ type: 'error', msg: result.error }); return }
    onUserUpdate(result.user); setPreview(null); setPendingFile(null)
    setAvatarFeedback({ type: 'success', msg: 'Foto de perfil actualizada.' })
  }

  const handleDeleteAvatar = async () => {
    setAvatarLoading(true); setAvatarFeedback(null)
    const result = await deleteAvatar(user.userId)
    setAvatarLoading(false)
    if (result.error) { setAvatarFeedback({ type: 'error', msg: result.error }); return }
    onUserUpdate(result.user); setAvatarFeedback({ type: 'success', msg: 'Foto de perfil eliminada.' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setFeedback({ type: 'error', msg: 'El nombre no puede estar vacío.' }); return }
    setLoading(true)
    const result = await updateProfile({ name: form.name, empresa: form.empresa, bio: form.bio })
    setLoading(false)
    if (result.error) { setFeedback({ type: 'error', msg: result.error }); return }
    onUserUpdate(result.user); setFeedback({ type: 'success', msg: 'Perfil actualizado correctamente.' })
  }

  const displayAvatar = preview ? { ...user, avatar_url: preview } : user

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <SectionTitle>Foto de perfil</SectionTitle>
        <div className="mt-5 flex items-start gap-6">
          <div className="relative group flex-shrink-0">
            <div className="cursor-pointer" onClick={() => !avatarLoading && fileRef.current?.click()} title="Cambiar foto"
              style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px #D9C9B8', background: '#EDE3D8', position: 'relative' }}
            >
              {displayAvatar?.avatar_url ? (
                <img src={displayAvatar.avatar_url} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 30, color: '#1E1D16' }}>
                  {(user?.name?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-act-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconCamera />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          </div>
          <div className="flex-1 space-y-3 pt-1">
            {!preview ? (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={avatarLoading}
                  className="border border-act-beige2 text-act-black/70 px-4 py-2 text-xs font-medium hover:border-act-black/40 hover:text-act-black transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
                  Cambiar foto
                </button>
                {user?.avatar_url && (
                  <button type="button" onClick={handleDeleteAvatar} disabled={avatarLoading}
                    className="border border-act-beige2 text-act-beige3 px-4 py-2 text-xs font-medium hover:border-act-burg/40 hover:text-act-burg transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
                    {avatarLoading ? 'Eliminando...' : 'Eliminar foto'}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleUpload} disabled={avatarLoading}
                  className="bg-act-burg text-act-white px-4 py-2 text-xs font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
                  {avatarLoading ? 'Subiendo...' : 'Subir foto'}
                </button>
                <button type="button" onClick={() => { setPreview(null); setPendingFile(null); setAvatarFeedback(null) }} disabled={avatarLoading}
                  className="border border-act-beige2 text-act-beige3 px-4 py-2 text-xs font-medium hover:text-act-black transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
                  Cancelar
                </button>
              </div>
            )}
            <p className="text-xs text-act-beige3">JPG, PNG o WebP · Máximo {MAX_SIZE_MB}MB</p>
            {avatarFeedback && <Alert type={avatarFeedback.type}>{avatarFeedback.msg}</Alert>}
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Informacion personal</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div><Label>Nombre completo</Label><Input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tu nombre completo" /></div>
          <div>
            <Label>Email</Label><Input type="email" value={user?.email ?? ''} disabled />
            <p className="text-xs text-act-beige3 mt-1.5">El email no se puede modificar desde aqui.</p>
          </div>
          <div><Label>Empresa / Organizacion</Label><Input type="text" value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Nombre de tu empresa (opcional)" /></div>
          <div>
            <Label>Descripción</Label>
            <textarea
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="Cuéntanos algo sobre ti, tu experiencia o tus intereses..."
              rows={3}
              className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3 resize-none"
              style={{ borderRadius: '2px' }}
            />
          </div>
          {feedback && <Alert type={feedback.type}>{feedback.msg}</Alert>}
          <SaveBtn loading={loading} />
        </form>
      </div>

      {/* Share link */}
      <div>
        <SectionTitle>Perfil público</SectionTitle>
        <p className="text-xs text-act-beige3 mb-3 mt-1">Comparte tu perfil y tus certificaciones con un enlace único.</p>
        <div className="flex items-center gap-2 border border-act-beige2 bg-act-beige1/40 px-3 py-2.5" style={{ borderRadius: '2px' }}>
          <span className="text-xs text-act-black/60 flex-1 truncate font-mono">{profileUrl}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-act-burg hover:text-act-burg-d transition-colors flex-shrink-0"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Copiado
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                Copiar enlace
              </>
            )}
          </button>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-act-beige3 hover:text-act-black transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            Ver
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Section: Seguridad ────────────────────────────────────────────────────────

function Seguridad({ user, onLogout }) {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading]   = useState(false)
  const [pwFeedback, setPwFeedback] = useState(null)
  const [resetLoading, setResetLoading]   = useState(false)
  const [resetFeedback, setResetFeedback] = useState(null)
  const [deleteStep, setDeleteStep]   = useState(0)
  const [deleteError, setDeleteError] = useState('')

  const setPw = (k, v) => { setPwForm(p => ({ ...p, [k]: v })); setPwFeedback(null) }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.next.length < 6) { setPwFeedback({ type: 'error', msg: 'La nueva contraseña debe tener al menos 6 caracteres.' }); return }
    if (pwForm.next !== pwForm.confirm) { setPwFeedback({ type: 'error', msg: 'Las contraseñas nuevas no coinciden.' }); return }
    setPwLoading(true)
    const result = await updatePassword({ currentPassword: pwForm.current, newPassword: pwForm.next })
    setPwLoading(false)
    if (result.error) { setPwFeedback({ type: 'error', msg: result.error }); return }
    setPwForm({ current: '', next: '', confirm: '' }); setPwFeedback({ type: 'success', msg: 'Contraseña actualizada correctamente.' })
  }

  const handleResetEmail = async () => {
    setResetLoading(true); setResetFeedback(null)
    const result = await sendPasswordReset(user.email)
    setResetLoading(false)
    if (result.error) { setResetFeedback({ type: 'error', msg: result.error }); return }
    setResetFeedback({ type: 'success', msg: `Email enviado a ${user.email}. Revisa tu bandeja de entrada.` })
  }

  const handleDeleteAccount = async () => {
    setDeleteStep(2)
    const result = await deleteAccount()
    if (result.error) { setDeleteError(result.error); setDeleteStep(1); return }
    onLogout()
  }

  return (
    <div className="space-y-10 max-w-lg">
      <div>
        <SectionTitle>Cambiar contraseña</SectionTitle>
        <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
          <div><Label>Contraseña actual</Label><Input type="password" value={pwForm.current} onChange={e => setPw('current', e.target.value)} required placeholder="••••••••" /></div>
          <div><Label>Nueva contraseña</Label><Input type="password" value={pwForm.next} onChange={e => setPw('next', e.target.value)} required placeholder="Minimo 6 caracteres" /></div>
          <div><Label>Confirmar nueva contraseña</Label><Input type="password" value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)} required placeholder="Repite la nueva contraseña" /></div>
          {pwFeedback && <Alert type={pwFeedback.type}>{pwFeedback.msg}</Alert>}
          <SaveBtn loading={pwLoading} label="Cambiar contraseña" />
        </form>
      </div>
      <div className="border-t border-act-beige1 pt-8">
        <SectionTitle>Restablecer por email</SectionTitle>
        <p className="text-sm text-act-beige3 mt-2 mb-4">
          Recibirás un enlace en <span className="text-act-black font-medium">{user?.email}</span> para restablecer tu contraseña sin necesidad de conocer la actual.
        </p>
        {resetFeedback && <div className="mb-3"><Alert type={resetFeedback.type}>{resetFeedback.msg}</Alert></div>}
        <button onClick={handleResetEmail} disabled={resetLoading}
          className="border border-act-beige2 text-act-black/70 px-5 py-2.5 text-sm font-medium hover:border-act-burg hover:text-act-burg transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
          {resetLoading ? 'Enviando...' : 'Enviar email de restablecimiento'}
        </button>
      </div>
      <div className="border-t border-act-beige1 pt-8">
        <div className="flex items-center gap-2 mb-3"><div className="h-px w-4 bg-act-burg" /><span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Zona de riesgo</span></div>
        <h3 className="font-display text-lg font-semibold text-act-black mb-2">Eliminar cuenta</h3>
        <p className="text-sm text-act-beige3 mb-5">Esta accion es permanente e irreversible. Se eliminarán tu cuenta y todos tus datos de progreso.</p>
        {deleteStep === 0 && (
          <button onClick={() => setDeleteStep(1)} className="border border-act-burg/40 text-act-burg px-5 py-2.5 text-sm font-medium hover:bg-act-burg hover:text-act-white transition-colors" style={{ borderRadius: '2px' }}>
            Eliminar mi cuenta
          </button>
        )}
        {deleteStep >= 1 && (
          <div className="border border-act-burg/30 bg-red-50 p-5 space-y-4" style={{ borderRadius: '2px' }}>
            <p className="text-sm font-medium text-act-burg">¿Seguro que quieres eliminar tu cuenta? Esta accion no se puede deshacer.</p>
            {deleteError && <Alert type="error">{deleteError}</Alert>}
            <div className="flex items-center gap-3">
              <button onClick={handleDeleteAccount} disabled={deleteStep === 2}
                className="bg-act-burg text-act-white px-5 py-2.5 text-sm font-medium hover:bg-act-burg-d transition-colors disabled:opacity-50" style={{ borderRadius: '2px' }}>
                {deleteStep === 2 ? 'Eliminando...' : 'Si, eliminar cuenta'}
              </button>
              <button onClick={() => { setDeleteStep(0); setDeleteError('') }} disabled={deleteStep === 2} className="text-sm text-act-beige3 hover:text-act-black transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Ranking ─────────────────────────────────────────────────────────

function Ranking({ user, catalog }) {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [settingsRes, profilesRes, progressRes] = await Promise.all([
        supabase.from('settings').select('key, value'),
        supabase.from('profiles').select('id, name, empresa, avatar_url, role').in('role', ['activum', 'admin']),
        supabase.from('progress').select('user_id, course_id, progress'),
      ])

      // Extraer pesos: quiz global + pesos individuales por curso
      const settings = {}
      ;(settingsRes.data ?? []).forEach(({ key, value }) => { settings[key] = value })
      const quizWeight = Number(settings['ranking_quiz_weight'] ?? 1)
      // Mapa { courseId: points }
      const courseWeightMap = {}
      Object.entries(settings).forEach(([key, value]) => {
        const match = key.match(/^ranking_course_weight_(.+)$/)
        if (match) courseWeightMap[match[1]] = Number(value)
      })
      const defaultCourseWeight = 300

      // Mapa de cursos publicados con total de items para calcular % completado
      const publishedCourses = (catalog ?? []).filter(c => c.status === 'published')
      const publishedIds     = new Set(publishedCourses.map(c => c.id))
      const courseMetaMap    = {}
      publishedCourses.forEach(c => { courseMetaMap[c.id] = c })

      const profiles    = profilesRes.data ?? []
      const allProgress = progressRes.data ?? []

      const scored = profiles.map(profile => {
        const userProgress = allProgress.filter(p => p.user_id === profile.id && publishedIds.has(p.course_id))

        let completedCourses = 0
        let courseScore = 0
        const allScores = []

        userProgress.forEach(p => {
          const prog  = p.progress ?? {}
          const meta  = courseMetaMap[p.course_id]
          const total = (meta?.lessons ?? 0) + (meta?.modules ?? 0)
          const done  = (prog.completedLessons?.length ?? 0) + Object.keys(prog.completedQuizzes ?? {}).length
          // Curso completado al 100% (misma lógica que ProfileApp)
          const isComplete = total > 0 && done >= total
          if (isComplete) {
            completedCourses++
            courseScore += courseWeightMap[p.course_id] ?? defaultCourseWeight
            Object.values(prog.quizScores ?? {}).forEach(s => allScores.push(s))
          }
        })

        const avgQuiz = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
        const score   = Math.round(courseScore + avgQuiz * quizWeight)

        return { ...profile, completedCourses, avgQuiz, score }
      })

      scored.sort((a, b) => b.score - a.score)
      setRows(scored)
      setLoading(false)
    }
    load()
  }, [catalog])

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando ranking...</span>
    </div>
  )

  const myIdx   = rows.findIndex(r => r.id === user?.userId)
  const noPerms = rows.length <= 1

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>Ranking Activum</SectionTitle>
        <p className="text-xs text-act-beige3 mt-1">Posición de los miembros según cursos completados y notas obtenidas.</p>
      </div>

      {noPerms && (
        <div className="text-xs border border-amber-200 bg-amber-50 text-amber-700 px-4 py-3" style={{ borderRadius: '2px' }}>
          No se pueden cargar los perfiles del resto de usuarios. Un administrador debe ejecutar en Supabase:
          <code className="block mt-1.5 font-mono bg-amber-100 px-2 py-1" style={{ borderRadius: '2px' }}>
            CREATE POLICY "profiles_read_authenticated" ON profiles FOR SELECT TO authenticated USING (true);
          </code>
        </div>
      )}

      {/* My position card */}
      {myIdx > -1 && (
        <div className="border border-act-burg/30 bg-act-burg/5 p-4 flex items-center gap-4" style={{ borderRadius: '2px' }}>
          <span className="font-display text-2xl font-semibold text-act-burg w-8 text-center">#{myIdx + 1}</span>
          <UserAvatar user={rows[myIdx]} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-act-black truncate">{rows[myIdx].name || 'Tú'}</div>
            <div className="text-xs text-act-beige3 mt-0.5">{rows[myIdx].empresa || ''}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-display text-xl font-semibold text-act-burg">{rows[myIdx].score.toLocaleString('es-ES')}</div>
            <div className="text-[10px] text-act-beige3">puntos</div>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <div className="border border-act-beige2" style={{ borderRadius: '2px' }}>
        {/* Header */}
        <div className="grid gap-2 px-4 py-2.5 bg-act-beige1/60 border-b border-act-beige2" style={{ gridTemplateColumns: '2rem 1fr 5rem 5rem 6rem' }}>
          <span className="text-[10px] font-medium text-act-beige3 tracking-widest uppercase">#</span>
          <span className="text-[10px] font-medium text-act-beige3 tracking-widest uppercase">Usuario</span>
          <span className="text-[10px] font-medium text-act-beige3 tracking-widest uppercase text-center">Cursos</span>
          <span className="text-[10px] font-medium text-act-beige3 tracking-widest uppercase text-center">Media</span>
          <span className="text-[10px] font-medium text-act-beige3 tracking-widest uppercase text-right">Puntos</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-4 py-8 text-sm text-act-beige3 text-center">Aún no hay datos de ranking.</div>
        ) : rows.map((row, idx) => {
          const isMe = row.id === user?.userId
          return (
            <div key={row.id}
              className={`grid gap-2 px-4 py-3 items-center border-b border-act-beige1 last:border-b-0 ${isMe ? 'bg-act-burg/5' : idx % 2 === 0 ? 'bg-act-white' : 'bg-act-beige1/20'}`}
              style={{ gridTemplateColumns: '2rem 1fr 5rem 5rem 6rem' }}>
              {/* Position */}
              <span className={`text-sm font-semibold text-center ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-act-beige3' : idx === 2 ? 'text-amber-700' : 'text-act-beige3'}`}>
                {idx < 3 ? ['★','✦','·'][idx] : ''}{idx + 1}
              </span>
              {/* User */}
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatar user={row} size={28} />
                <div className="min-w-0">
                  <div className={`text-xs font-medium truncate ${isMe ? 'text-act-burg' : 'text-act-black'}`}>
                    {row.name || row.email || '—'}{isMe && <span className="ml-1 text-[10px] text-act-beige3">(tú)</span>}
                  </div>
                  {row.empresa && <div className="text-[10px] text-act-beige3 truncate">{row.empresa}</div>}
                </div>
              </div>
              {/* Courses */}
              <span className="text-xs text-act-black/70 text-center">{row.completedCourses}</span>
              {/* Avg quiz */}
              <span className="text-xs text-act-black/70 text-center">{row.avgQuiz > 0 ? `${row.avgQuiz}%` : '—'}</span>
              {/* Score */}
              <span className={`text-sm font-semibold text-right ${isMe ? 'text-act-burg' : 'text-act-black'}`}>
                {row.score.toLocaleString('es-ES')}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-act-beige3">
        Fórmula: cursos completados × peso_curso + media_quizzes × peso_quiz. Los pesos los configura el administrador.
      </p>
    </div>
  )
}

// ── Dashboard (main) ──────────────────────────────────────────────────────────

export default function Dashboard({ user, catalog = defaultCatalog, userProgressMap, onEnterCourse, onGoHome, onLogout, onUserUpdate, initialSection = 'cursos', onSectionChange }) {
  const isActivum = user?.role === 'activum' || user?.role === 'admin'
  const [section, setSection] = useState(initialSection)
  const [mobileOpen, setMobileOpen] = useState(false)

  const changeSection = (s) => { setSection(s); onSectionChange?.(s) }

  const isAdmin = user?.role === 'admin'

  const NAV = [
    { id: 'cursos',    label: 'Mis cursos', Icon: IconCourses  },
    ...(isActivum ? [{ id: 'ranking', label: 'Ranking', Icon: IconRanking }] : []),
    { id: 'perfil',    label: 'Mi perfil',  Icon: IconProfile  },
    { id: 'seguridad', label: 'Seguridad',  Icon: IconSecurity },
  ]

  const sectionTitles = { cursos: 'Mis Cursos', ranking: 'Ranking', perfil: 'Mi Perfil', seguridad: 'Seguridad' }

  return (
    <div className="min-h-screen bg-act-white text-act-black flex flex-col">
      {/* Top nav */}
      <header className="border-b border-act-beige1 bg-act-white sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onGoHome} className="hover:opacity-70 transition-opacity"><ActivumLogo size="sm" /></button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <UserAvatar user={user} size={32} />
              <span className="text-sm font-medium text-act-black">{user?.name?.split(' ')[0]}</span>
            </div>
            <button onClick={onLogout}
              className="text-xs text-act-beige3 border border-act-beige2 px-4 py-2 hover:border-act-beige3 hover:text-act-black transition-colors" style={{ borderRadius: '2px' }}>
              Cerrar sesion
            </button>
            <button className="md:hidden text-act-black/60 hover:text-act-black transition-colors" onClick={() => setMobileOpen(o => !o)}><IconMenu /></button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full px-6 py-10 gap-10">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-52">
          <div className="border border-act-beige2 p-4 mb-6" style={{ borderRadius: '2px' }}>
            <div className="mb-3"><UserAvatar user={user} size={40} /></div>
            <div className="font-medium text-sm text-act-black leading-snug truncate">{user?.name}</div>
            <div className="text-xs text-act-beige3 truncate mt-0.5">{user?.email}</div>
            {user?.empresa && <div className="text-xs text-act-beige3 mt-1 truncate">{user.empresa}</div>}
            {user?.role && (
              <div className="mt-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 ${isAdmin ? 'bg-act-burg text-white' : user.role === 'activum' ? 'bg-act-black text-white' : 'border border-act-beige2 text-act-beige3'}`} style={{ borderRadius: '2px' }}>
                  {user.role}
                </span>
              </div>
            )}
          </div>

          <nav className="space-y-0.5">
            {NAV.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => changeSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${section === id ? 'bg-act-beige1 text-act-black' : 'text-act-beige3 hover:text-act-black hover:bg-act-beige1/50'}`}
                style={{ borderRadius: '2px' }}
              >
                <span className={section === id ? 'text-act-burg' : ''}><Icon /></span>
                {label}
              </button>
            ))}
          </nav>

          {isAdmin && (
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid #D9C9B8' }}>
              <button
                onClick={() => window.open('/admin.html', '_blank', 'noopener')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left text-act-beige3 hover:text-act-black hover:bg-act-beige1/50"
                style={{ borderRadius: '2px' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span className="flex-1">Admin</span>
                <svg className="w-3 h-3 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>
            </div>
          )}

          <button onClick={onGoHome} className="mt-4 flex items-center gap-2 text-xs text-act-beige3 hover:text-act-black transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Volver al inicio
          </button>
        </aside>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-act-black/30" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-16 left-0 right-0 bg-act-white border-b border-act-beige2 px-6 py-3 space-y-1" onClick={e => e.stopPropagation()}>
              {NAV.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => { changeSection(id); setMobileOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left ${section === id ? 'text-act-burg' : 'text-act-black/70'}`}
                ><Icon />{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-act-beige3 tracking-widest uppercase">Dashboard</span>
            <span className="text-act-beige2">/</span>
            <span className="text-xs text-act-black tracking-widest uppercase font-medium">{sectionTitles[section]}</span>
          </div>

          {section === 'cursos'    && <MisCursos catalog={catalog} userProgressMap={userProgressMap} onEnterCourse={onEnterCourse} />}
          {section === 'ranking'   && <Ranking   user={user} catalog={catalog} />}
          {section === 'perfil'    && <MiPerfil  user={user} onUserUpdate={onUserUpdate} />}
          {section === 'seguridad' && <Seguridad user={user} onLogout={onLogout} />}
        </main>
      </div>
    </div>
  )
}
