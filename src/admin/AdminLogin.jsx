import { useState } from 'react'
import { supabase } from '../supabase'

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1. Autenticar con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    // 2. Verificar que el role en profiles es 'admin'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', authData.user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Acceso denegado. Esta área es exclusiva para administradores.')
      setLoading(false)
      return
    }

    // 3. Acceso concedido
    onSuccess({
      id:    authData.user.id,
      name:  authData.user.user_metadata?.name ?? authData.user.email,
      email: authData.user.email,
      role:  'admin',
    })
  }

  return (
    <div className="min-h-screen bg-act-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10 select-none">
          <div className="text-center">
            <div className="font-display text-3xl font-light tracking-widest uppercase" style={{ color: '#F7F2EA' }}>
              Activum
            </div>
            <div className="font-sans text-xs tracking-[0.3em] uppercase mt-0.5" style={{ color: '#8C1736' }}>
              Academy
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-act-white border border-act-beige2 p-8" style={{ borderRadius: '2px' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-5 bg-act-burg flex-shrink-0" />
            <span className="text-[11px] text-act-burg tracking-[0.25em] uppercase font-medium">Panel de administración</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-act-black mb-6">
            Acceso restringido
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@activum.es"
                className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3 transition-colors"
                style={{ borderRadius: '2px' }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3 transition-colors"
                style={{ borderRadius: '2px' }}
              />
            </div>

            {error && (
              <div className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2.5" style={{ borderRadius: '2px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-act-burg text-white py-2.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50 mt-2"
              style={{ borderRadius: '2px' }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-act-beige3 mt-6">
          Activum Academy · Panel de administración
        </p>
      </div>
    </div>
  )
}
