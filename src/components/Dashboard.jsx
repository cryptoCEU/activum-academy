import { useState } from 'react'
import ActivumLogo from './ActivumLogo'
import { catalogData } from '../data/catalogData'
import { updateProfile, updatePassword, sendPasswordReset, deleteAccount } from '../auth'

// ── SVG Icons ────────────────────────────────────────────────────────────────

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

// ── Label helper ─────────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">
      {children}
    </label>
  )
}

function Input({ disabled, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`w-full border bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none transition-colors placeholder:text-act-beige3 ${
        disabled
          ? 'border-act-beige1 text-act-beige3 cursor-not-allowed'
          : 'border-act-beige2 focus:border-act-burg'
      }`}
      style={{ borderRadius: '2px' }}
    />
  )
}

function SaveBtn({ loading, label = 'Guardar cambios' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="bg-act-burg text-act-white px-6 py-2.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50"
      style={{ borderRadius: '2px' }}
    >
      {loading ? 'Guardando...' : label}
    </button>
  )
}

function Alert({ type, children }) {
  const styles = {
    success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    error:   'text-act-burg bg-red-50 border-red-100',
    info:    'text-act-black/70 bg-act-beige1 border-act-beige2',
  }
  return (
    <div className={`text-xs border px-3 py-2.5 ${styles[type]}`} style={{ borderRadius: '2px' }}>
      {children}
    </div>
  )
}

// ── Section: Mis Cursos ───────────────────────────────────────────────────────

function MisCursos({ userProgressMap, onEnterCourse }) {
  const published  = catalogData.filter(c => c.status === 'published')
  const comingSoon = catalogData.filter(c => c.status === 'coming_soon')

  const progressOf = (course) => {
    const p = userProgressMap?.[course.id]
    if (!p) return 0
    return Math.round(((p.completedLessons?.length || 0) / course.lessons) * 100)
  }

  const activeCourses    = published.filter(c => progressOf(c) > 0)
  const totalCompleted   = Object.values(userProgressMap || {})
    .reduce((s, p) => s + (p?.completedLessons?.length || 0), 0)
  const avgProgress      = published.length
    ? Math.round(published.reduce((s, c) => s + progressOf(c), 0) / published.length)
    : 0

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div>
        <SectionTitle>Resumen</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Cursos activos',      value: activeCourses.length },
            { label: 'Progreso medio',       value: `${avgProgress}%` },
            { label: 'Lecciones completadas', value: totalCompleted },
          ].map(s => (
            <div key={s.label} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
              <div className="font-display text-3xl font-light text-act-black mb-1">{s.value}</div>
              <div className="text-xs text-act-beige3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cursos en progreso */}
      <div>
        <SectionTitle>Cursos en progreso</SectionTitle>
        {published.length === 0 ? (
          <p className="text-sm text-act-beige3 mt-3">No hay cursos publicados aun.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {published.map(course => {
              const pct = progressOf(course)
              return (
                <div
                  key={course.id}
                  className="border border-act-beige2 bg-act-white p-5"
                  style={{ borderRadius: '2px' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-act-burg border border-act-burg/25 bg-act-burg/5 px-2 py-0.5 font-medium" style={{ borderRadius: '2px' }}>
                          {course.category}
                        </span>
                        <span className="text-xs text-act-beige3">{course.duration}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-act-black leading-snug mb-3">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-act-beige2" style={{ borderRadius: '1px' }}>
                          <div
                            className="h-full bg-act-burg transition-all"
                            style={{ width: `${pct}%`, borderRadius: '1px' }}
                          />
                        </div>
                        <span className="text-xs text-act-burg font-medium w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onEnterCourse(course.id)}
                      className="flex-shrink-0 flex items-center gap-1.5 border border-act-beige2 text-act-black/70 px-4 py-2 text-xs font-medium hover:border-act-burg hover:text-act-burg transition-colors"
                      style={{ borderRadius: '2px' }}
                    >
                      {pct > 0 ? 'Continuar' : 'Comenzar'}
                      <IconArrow />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Proximamente */}
      <div>
        <SectionTitle>Proximamente</SectionTitle>
        <div className="space-y-3 mt-4">
          {comingSoon.map(course => (
            <div
              key={course.id}
              className="border border-act-beige1 bg-act-white p-5 opacity-60"
              style={{ borderRadius: '2px' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-act-beige3 mb-1">{course.category} · {course.duration}</div>
                  <h3 className="font-display text-base font-semibold text-act-black">{course.title}</h3>
                </div>
                <span className="text-xs text-act-beige3 border border-act-beige2 px-2.5 py-1" style={{ borderRadius: '2px' }}>
                  Proximo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section: Mi Perfil ────────────────────────────────────────────────────────

function MiPerfil({ user, onUserUpdate }) {
  const [form, setForm]   = useState({ name: user?.name ?? '', empresa: user?.empresa ?? '' })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setFeedback(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setFeedback({ type: 'error', msg: 'El nombre no puede estar vacío.' }); return }
    setLoading(true)
    const result = await updateProfile({ name: form.name, empresa: form.empresa })
    setLoading(false)
    if (result.error) { setFeedback({ type: 'error', msg: result.error }); return }
    onUserUpdate(result.user)
    setFeedback({ type: 'success', msg: 'Perfil actualizado correctamente.' })
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <SectionTitle>Informacion personal</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label>Nombre completo</Label>
            <Input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={user?.email ?? ''} disabled />
            <p className="text-xs text-act-beige3 mt-1.5">El email no se puede modificar desde aqui.</p>
          </div>
          <div>
            <Label>Empresa / Organizacion</Label>
            <Input
              type="text"
              value={form.empresa}
              onChange={e => set('empresa', e.target.value)}
              placeholder="Nombre de tu empresa (opcional)"
            />
          </div>
          {feedback && <Alert type={feedback.type}>{feedback.msg}</Alert>}
          <SaveBtn loading={loading} />
        </form>
      </div>
    </div>
  )
}

// ── Section: Seguridad ────────────────────────────────────────────────────────

function Seguridad({ user, onLogout }) {
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwFeedback, setPwFeedback] = useState(null)

  const [resetLoading, setResetLoading] = useState(false)
  const [resetFeedback, setResetFeedback] = useState(null)

  const [deleteStep, setDeleteStep] = useState(0) // 0 = idle, 1 = confirm, 2 = loading
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
    setPwForm({ current: '', next: '', confirm: '' })
    setPwFeedback({ type: 'success', msg: 'Contraseña actualizada correctamente.' })
  }

  const handleResetEmail = async () => {
    setResetLoading(true)
    setResetFeedback(null)
    const result = await sendPasswordReset(user.email)
    setResetLoading(false)
    if (result.error) { setResetFeedback({ type: 'error', msg: result.error }); return }
    setResetFeedback({ type: 'success', msg: `Email enviado a ${user.email}. Revisa tu bandeja de entrada.` })
  }

  const handleDeleteAccount = async () => {
    setDeleteStep(2)
    const result = await deleteAccount()
    if (result.error) {
      setDeleteError(result.error)
      setDeleteStep(1)
      return
    }
    onLogout()
  }

  return (
    <div className="space-y-10 max-w-lg">

      {/* Cambiar contraseña */}
      <div>
        <SectionTitle>Cambiar contraseña</SectionTitle>
        <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
          <div>
            <Label>Contraseña actual</Label>
            <Input type="password" value={pwForm.current} onChange={e => setPw('current', e.target.value)} required placeholder="••••••••" />
          </div>
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" value={pwForm.next} onChange={e => setPw('next', e.target.value)} required placeholder="Minimo 6 caracteres" />
          </div>
          <div>
            <Label>Confirmar nueva contraseña</Label>
            <Input type="password" value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)} required placeholder="Repite la nueva contraseña" />
          </div>
          {pwFeedback && <Alert type={pwFeedback.type}>{pwFeedback.msg}</Alert>}
          <SaveBtn loading={pwLoading} label="Cambiar contraseña" />
        </form>
      </div>

      {/* Restablecer por email */}
      <div className="border-t border-act-beige1 pt-8">
        <SectionTitle>Restablecer por email</SectionTitle>
        <p className="text-sm text-act-beige3 mt-2 mb-4">
          Recibirás un enlace en <span className="text-act-black font-medium">{user?.email}</span> para restablecer tu contraseña sin necesidad de conocer la actual.
        </p>
        {resetFeedback && <div className="mb-3"><Alert type={resetFeedback.type}>{resetFeedback.msg}</Alert></div>}
        <button
          onClick={handleResetEmail}
          disabled={resetLoading}
          className="border border-act-beige2 text-act-black/70 px-5 py-2.5 text-sm font-medium hover:border-act-burg hover:text-act-burg transition-colors disabled:opacity-50"
          style={{ borderRadius: '2px' }}
        >
          {resetLoading ? 'Enviando...' : 'Enviar email de restablecimiento'}
        </button>
      </div>

      {/* Zona de riesgo */}
      <div className="border-t border-act-beige1 pt-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-4 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Zona de riesgo</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-act-black mb-2">Eliminar cuenta</h3>
        <p className="text-sm text-act-beige3 mb-5">
          Esta accion es permanente e irreversible. Se eliminarán tu cuenta y todos tus datos de progreso.
        </p>

        {deleteStep === 0 && (
          <button
            onClick={() => setDeleteStep(1)}
            className="border border-act-burg/40 text-act-burg px-5 py-2.5 text-sm font-medium hover:bg-act-burg hover:text-act-white transition-colors"
            style={{ borderRadius: '2px' }}
          >
            Eliminar mi cuenta
          </button>
        )}

        {deleteStep >= 1 && (
          <div className="border border-act-burg/30 bg-red-50 p-5 space-y-4" style={{ borderRadius: '2px' }}>
            <p className="text-sm font-medium text-act-burg">
              ¿Seguro que quieres eliminar tu cuenta? Esta accion no se puede deshacer.
            </p>
            {deleteError && <Alert type="error">{deleteError}</Alert>}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteStep === 2}
                className="bg-act-burg text-act-white px-5 py-2.5 text-sm font-medium hover:bg-act-burg-d transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {deleteStep === 2 ? 'Eliminando...' : 'Si, eliminar cuenta'}
              </button>
              <button
                onClick={() => { setDeleteStep(0); setDeleteError('') }}
                disabled={deleteStep === 2}
                className="text-sm text-act-beige3 hover:text-act-black transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section title helper ──────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-5 bg-act-burg flex-shrink-0" />
      <h2 className="font-display text-xl font-semibold text-act-black">{children}</h2>
    </div>
  )
}

// ── Nav items config ──────────────────────────────────────────────────────────

const NAV = [
  { id: 'cursos',    label: 'Mis cursos',  Icon: IconCourses  },
  { id: 'perfil',    label: 'Mi perfil',   Icon: IconProfile  },
  { id: 'seguridad', label: 'Seguridad',   Icon: IconSecurity },
]

// ── Dashboard (main) ──────────────────────────────────────────────────────────

export default function Dashboard({ user, userProgressMap, onEnterCourse, onGoHome, onLogout, onUserUpdate }) {
  const [section, setSection]     = useState('cursos')
  const [mobileOpen, setMobileOpen] = useState(false)

  const sectionTitles = { cursos: 'Mis Cursos', perfil: 'Mi Perfil', seguridad: 'Seguridad' }

  return (
    <div className="min-h-screen bg-act-white text-act-black flex flex-col">

      {/* Top nav */}
      <header className="border-b border-act-beige1 bg-act-white sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onGoHome} className="hover:opacity-70 transition-opacity">
            <ActivumLogo size="sm" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-act-beige3 hidden sm:block">
              <span className="text-act-black font-medium">{user?.name?.split(' ')[0]}</span>
            </span>
            <button
              onClick={onLogout}
              className="text-xs text-act-beige3 border border-act-beige2 px-4 py-2 hover:border-act-beige3 hover:text-act-black transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Cerrar sesion
            </button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-act-black/60 hover:text-act-black transition-colors"
              onClick={() => setMobileOpen(o => !o)}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full px-6 py-10 gap-10">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-52">
          {/* User card */}
          <div className="border border-act-beige2 p-4 mb-6" style={{ borderRadius: '2px' }}>
            <div
              className="w-10 h-10 bg-act-burg text-act-white flex items-center justify-center font-display text-lg font-semibold mb-3"
              style={{ borderRadius: '2px' }}
            >
              {(user?.name?.[0] ?? '?').toUpperCase()}
            </div>
            <div className="font-medium text-sm text-act-black leading-snug truncate">{user?.name}</div>
            <div className="text-xs text-act-beige3 truncate mt-0.5">{user?.email}</div>
            {user?.empresa && (
              <div className="text-xs text-act-beige3 mt-1 truncate">{user.empresa}</div>
            )}
          </div>

          {/* Nav */}
          <nav className="space-y-0.5">
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  section === id
                    ? 'bg-act-beige1 text-act-black'
                    : 'text-act-beige3 hover:text-act-black hover:bg-act-beige1/50'
                }`}
                style={{ borderRadius: '2px' }}
              >
                <span className={section === id ? 'text-act-burg' : ''}><Icon /></span>
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={onGoHome}
            className="mt-auto flex items-center gap-2 text-xs text-act-beige3 hover:text-act-black transition-colors pt-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Volver al inicio
          </button>
        </aside>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-act-black/30" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-16 left-0 right-0 bg-act-white border-b border-act-beige2 px-6 py-3 space-y-1" onClick={e => e.stopPropagation()}>
              {NAV.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => { setSection(id); setMobileOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                    section === id ? 'text-act-burg' : 'text-act-black/70'
                  }`}
                >
                  <Icon />{label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-act-beige3 tracking-widest uppercase">Dashboard</span>
            <span className="text-act-beige2">/</span>
            <span className="text-xs text-act-black tracking-widest uppercase font-medium">
              {sectionTitles[section]}
            </span>
          </div>

          {section === 'cursos'    && <MisCursos    userProgressMap={userProgressMap} onEnterCourse={onEnterCourse} />}
          {section === 'perfil'    && <MiPerfil     user={user} onUserUpdate={onUserUpdate} />}
          {section === 'seguridad' && <Seguridad    user={user} onLogout={onLogout} />}
        </main>
      </div>
    </div>
  )
}
