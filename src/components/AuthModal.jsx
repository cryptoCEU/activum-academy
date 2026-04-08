import { useState } from 'react'
import { register, login, sendPasswordReset, resetPasswordUpdate } from '../auth'
import ActivumLogo from './ActivumLogo'

export default function AuthModal({ initialMode = 'login', onSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '', newPassword: '', confirmPassword: '' })
  const [error, setError]     = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'forgot') {
      const result = await sendPasswordReset(form.email)
      setLoading(false)
      if (result.error) { setError(result.error); return }
      setMessage('Te hemos enviado un email con el enlace para restablecer tu contraseña.')
      return
    }

    if (mode === 'reset') {
      if (form.newPassword.length < 6) { setLoading(false); setError('La contraseña debe tener al menos 6 caracteres.'); return }
      if (form.newPassword !== form.confirmPassword) { setLoading(false); setError('Las contraseñas no coinciden.'); return }
      const result = await resetPasswordUpdate(form.newPassword)
      setLoading(false)
      if (result.error) { setError(result.error); return }
      setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.')
      setTimeout(() => { setMode('login'); setMessage('') }, 2000)
      return
    }

    const result = await (mode === 'register'
      ? register({ name: form.name, email: form.email, password: form.password })
      : login({ email: form.email, password: form.password }))
    setLoading(false)
    if (result.error) { setError(result.error); return }
    onSuccess(result.user)
  }

  const titles = {
    login:    'Iniciar sesión',
    register: 'Crear cuenta',
    forgot:   'Recuperar contraseña',
    reset:    'Nueva contraseña',
  }
  const subtitles = {
    login:    'Accede a tus cursos y retoma donde lo dejaste.',
    register: 'Regístrate gratis para empezar tu formación.',
    forgot:   'Introduce tu email y te enviaremos un enlace de acceso.',
    reset:    'Elige una nueva contraseña para tu cuenta.',
  }

  return (
    <div className="modal-backdrop animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-act-white w-full max-w-md shadow-card-hover animate-fade-up" style={{ borderRadius: '2px' }}>
        {/* Header */}
        <div className="border-b border-act-beige1 px-8 py-6 flex items-center justify-between">
          <ActivumLogo size="sm" />
          <button onClick={onClose} className="text-act-beige3 hover:text-act-black transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <h2 className="font-display text-2xl font-semibold text-act-black mb-1">{titles[mode]}</h2>
          <p className="text-sm text-act-beige3 mb-6">{subtitles[mode]}</p>

          {message && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2.5 mb-4" style={{ borderRadius: '2px' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">Nombre completo</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Maria Garcia" required
                  className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                  style={{ borderRadius: '2px' }} />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="nombre@empresa.com" required
                  className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                  style={{ borderRadius: '2px' }} />
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div>
                <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">Contraseña</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder={mode === 'register' ? 'Minimo 6 caracteres' : ''} required
                  className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                  style={{ borderRadius: '2px' }} />
              </div>
            )}

            {mode === 'reset' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">Nueva contraseña</label>
                  <input type="password" value={form.newPassword} onChange={e => set('newPassword', e.target.value)}
                    placeholder="Minimo 6 caracteres" required
                    className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                    style={{ borderRadius: '2px' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">Confirmar contraseña</label>
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repite la contraseña" required
                    className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                    style={{ borderRadius: '2px' }} />
                </div>
              </>
            )}

            {error && (
              <div className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2.5" style={{ borderRadius: '2px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-act-burg text-act-white py-3 text-sm font-medium tracking-[0.08em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50 mt-2"
              style={{ borderRadius: '2px' }}>
              {loading ? 'Un momento...' : {
                login: 'Entrar', register: 'Crear cuenta',
                forgot: 'Enviar enlace', reset: 'Guardar contraseña',
              }[mode]}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-act-beige1 px-8 py-4 text-center space-y-1">
          {mode === 'login' && (
            <>
              <div>
                <span className="text-sm text-act-beige3">¿No tienes cuenta? </span>
                <button onClick={() => { setMode('register'); setError(''); setMessage('') }}
                  className="text-sm text-act-burg font-medium hover:text-act-burg-d transition-colors">
                  Registrarse gratis
                </button>
              </div>
              <div>
                <button onClick={() => { setMode('forgot'); setError(''); setMessage('') }}
                  className="text-sm text-act-beige3 hover:text-act-black transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </>
          )}
          {mode === 'register' && (
            <div>
              <span className="text-sm text-act-beige3">¿Ya tienes cuenta? </span>
              <button onClick={() => { setMode('login'); setError(''); setMessage('') }}
                className="text-sm text-act-burg font-medium hover:text-act-burg-d transition-colors">
                Iniciar sesion
              </button>
            </div>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <div>
              <button onClick={() => { setMode('login'); setError(''); setMessage('') }}
                className="text-sm text-act-beige3 hover:text-act-black transition-colors">
                Volver a iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
