import { useState } from 'react'
import { register, login } from '../auth'
import ActivumLogo from './ActivumLogo'

export default function AuthModal({ initialMode = 'login', onSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = mode === 'register'
        ? register({ name: form.name, email: form.email, password: form.password })
        : login({ email: form.email, password: form.password })
      setLoading(false)
      if (result.error) { setError(result.error); return }
      onSuccess(result.user)
    }, 300)
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
          <h2 className="font-display text-2xl font-semibold text-act-black mb-1">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p className="text-sm text-act-beige3 mb-6">
            {mode === 'login'
              ? 'Accede a tus cursos y retoma donde lo dejaste.'
              : 'Regístrate gratis para empezar tu formación.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Maria Garcia"
                  required
                  className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                  style={{ borderRadius: '2px' }}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="nombre@empresa.com"
                required
                className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-act-black/60 tracking-widest uppercase mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder={mode === 'register' ? 'Minimo 6 caracteres' : ''}
                required
                className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors placeholder:text-act-beige3"
                style={{ borderRadius: '2px' }}
              />
            </div>

            {error && (
              <div className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2.5 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-act-burg text-act-white py-3 text-sm font-medium tracking-[0.08em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50 mt-2"
              style={{ borderRadius: '2px' }}
            >
              {loading ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <div className="border-t border-act-beige1 px-8 py-4 text-center">
          <span className="text-sm text-act-beige3">
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          </span>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-sm text-act-burg font-medium hover:text-act-burg-d transition-colors"
          >
            {mode === 'login' ? 'Registrarse gratis' : 'Iniciar sesion'}
          </button>
        </div>
      </div>
    </div>
  )
}
