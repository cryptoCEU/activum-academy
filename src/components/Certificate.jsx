import { useState } from 'react'

function IconLinkedIn() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function Certificate({ progress, user }) {
  const [generated, setGenerated] = useState(false)
  const name = user?.name || ''
  const [customName, setCustomName] = useState(name)

  const avgScore = (() => {
    const scores = Object.values(progress.quizScores || {})
    if (!scores.length) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })()

  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const issueYear  = new Date().getFullYear()
  const issueMonth = new Date().getMonth() + 1

  const courseTitle = 'Tokenizacion de Activos Inmobiliarios en Espana'

  const handleShareLinkedIn = () => {
    const params = new URLSearchParams({
      startTask:        'CERTIFICATION_NAME',
      name:             courseTitle,
      organizationName: 'Activum Academy',
      issueYear:        issueYear,
      issueMonth:       issueMonth,
      certUrl:          'https://academy.activum.es',
    })
    window.open(`https://www.linkedin.com/profile/add?${params.toString()}`, '_blank', 'noopener')
  }

  if (!generated) {
    return (
      <div className="flex flex-col h-full bg-act-white items-center justify-center px-8 animate-fade-in">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 border-2 border-act-burg flex items-center justify-center mx-auto mb-5" style={{ borderRadius: '2px' }}>
            <svg className="w-6 h-6 text-act-burg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
          <h2 className="font-display text-3xl font-semibold text-act-black mb-3">Certificado de Finalizacion</h2>
          <p className="text-act-beige3 text-sm mb-7 leading-relaxed">
            Enhorabuena. Has completado el curso con una puntuacion media del {avgScore}%. Confirma tu nombre para generar el certificado.
          </p>
          <div className="mb-5 text-left">
            <label className="block text-[10px] font-semibold text-act-black/50 tracking-[0.15em] uppercase mb-1.5">Nombre en el certificado</label>
            <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full border border-act-beige2 bg-act-white text-act-black px-4 py-2.5 text-sm focus:outline-none focus:border-act-burg transition-colors"
              style={{ borderRadius: '2px' }} />
          </div>
          <button onClick={() => customName.trim() && setGenerated(true)} disabled={!customName.trim()}
            className={`w-full py-3.5 text-sm font-medium tracking-[0.08em] uppercase transition-all ${
              customName.trim() ? 'bg-act-burg text-white hover:bg-act-burg-l' : 'bg-act-beige1 text-act-beige3 cursor-not-allowed'}`}
            style={{ borderRadius: '2px' }}>
            Generar Certificado
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-act-beige1">
      <div className="flex-shrink-0 bg-act-white border-b border-act-beige1 px-8 py-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-act-black">Tu Certificado</h2>
        <div className="flex gap-3">
          <button onClick={() => setGenerated(false)}
            className="text-xs border border-act-beige2 text-act-black/50 px-4 py-2 hover:border-act-black/30 transition-colors"
            style={{ borderRadius: '2px' }}>
            Editar nombre
          </button>
          <button
            onClick={handleShareLinkedIn}
            className="flex items-center gap-2 text-xs bg-[#0A66C2] text-white px-4 py-2 hover:bg-[#004182] transition-colors font-medium"
            style={{ borderRadius: '2px' }}>
            <IconLinkedIn />
            Añadir a LinkedIn
          </button>
          <button onClick={() => window.print()}
            className="text-xs bg-act-burg text-white px-4 py-2 hover:bg-act-burg-l transition-colors font-medium"
            style={{ borderRadius: '2px' }}>
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-act-white shadow-card-hover animate-fade-in" style={{
          padding: '56px 64px',
          position: 'relative', aspectRatio: '1.414 / 1',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          {/* Borders */}
          <div style={{ position: 'absolute', inset: '14px', border: '1px solid rgba(140,23,54,0.25)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: '18px', border: '0.5px solid rgba(140,23,54,0.1)', pointerEvents: 'none' }} />

          {/* Top */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.svg" alt="Activum" style={{ height: '36px', width: 'auto' }} />
                <div>
                  <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '13px', letterSpacing: '0.14em', color: '#1E1D16', fontWeight: 600 }}>ACTIVUM</div>
                  <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '8px', letterSpacing: '0.22em', color: '#8C1736', textTransform: 'uppercase' }}>Academy</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '8px', letterSpacing: '0.15em', color: '#8C1736', textTransform: 'uppercase', marginBottom: '2px' }}>Puntuacion media</div>
                <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '26px', fontWeight: 500, color: '#1E1D16' }}>{avgScore}%</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '8px', letterSpacing: '0.25em', color: '#8C1736', textTransform: 'uppercase', marginBottom: '6px' }}>Certificado de Finalizacion</div>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '12px', color: '#5a5347' }}>Este certificado acredita que</div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '40px', fontWeight: 400, fontStyle: 'italic', color: '#1E1D16', lineHeight: 1.1, borderBottom: '1px solid rgba(140,23,54,0.3)', paddingBottom: '10px', marginBottom: '8px' }}>
                {customName}
              </div>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '12px', color: '#5a5347' }}>ha completado satisfactoriamente el curso</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '20px', fontWeight: 600, color: '#1E1D16', letterSpacing: '0.01em', lineHeight: 1.2 }}>
                {courseTitle}
              </div>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '13px', color: '#8C1736', fontStyle: 'italic', marginTop: '4px' }}>
                De los Fundamentos a la Practica
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C1736', marginBottom: '2px' }}>Emitido el</div>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '12px', color: '#1E1D16' }}>{today}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontStyle: 'italic', fontSize: '16px', color: '#1E1D16', borderBottom: '1px solid #1E1D16', paddingBottom: '2px', marginBottom: '4px' }}>Activum Academy</div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '7px', letterSpacing: '0.12em', color: '#9CA3AF', textTransform: 'uppercase' }}>Direccion Academica</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C1736', marginBottom: '2px' }}>Duracion</div>
              <div style={{ fontFamily: 'Roboto Serif, serif', fontSize: '12px', color: '#1E1D16' }}>8 horas lectivas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
