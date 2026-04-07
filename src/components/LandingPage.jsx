import ActivumLogo from './ActivumLogo'

export default function LandingPage({ progress, completedLessons, totalLessons, onStart }) {
  const modules = [
    { n: '00', title: 'Introducción', desc: 'Bienvenida, metodología y glosario' },
    { n: '01', title: 'Fundamentos', desc: 'El mercado inmobiliario español y sus barreras' },
    { n: '02', title: 'Definiciones', desc: 'Tipos de tokens, activos y conceptos clave' },
    { n: '03', title: 'Tecnología', desc: 'Blockchain, smart contracts y estándares' },
    { n: '04', title: 'Regulación', desc: 'MiCA, CNMV, LMV y fiscalidad en España' },
    { n: '05', title: 'Casos de Uso', desc: 'Modelos de negocio y aplicaciones prácticas' },
    { n: '06', title: 'Ecosistema', desc: 'Plataformas globales y checklist del inversor' },
    { n: '07', title: 'Casos de Éxito', desc: 'Proyectos reales y lecciones aprendidas' },
    { n: '08', title: 'Riesgos', desc: 'Tecnológicos, legales y expectativas reales' },
    { n: '09', title: 'El Futuro', desc: 'RWA institucional y España 2030' },
    { n: '10', title: 'Proyecto Final', desc: 'Diseña tu propia tokenización + certificado' },
  ]

  return (
    <div className="min-h-screen bg-act-black text-act-white">
      {/* Header */}
      <header className="border-b border-white/8 px-8 py-5 flex items-center justify-between">
        <ActivumLogo size="md" />
        <nav className="flex items-center gap-6">
          <span className="text-sm text-white/40 font-light tracking-wide">Curso · Tokenización Inmobiliaria</span>
          {progress > 0 && (
            <button
              onClick={onStart}
              className="text-sm text-act-gold border border-act-gold/40 px-4 py-1.5 rounded hover:bg-act-gold/10 transition-colors"
            >
              Continuar →
            </button>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle at center, #8C1736 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.03]"
            style={{ background: 'radial-gradient(circle at center, #C4A96A 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(247,242,234,0.03)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-8 pt-24 pb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-act-burgundy"></div>
              <span className="text-act-gold text-xs tracking-[0.25em] uppercase font-medium">Activum Academy</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05] mb-6 text-act-white">
              Tokenización de<br />
              <em className="italic text-act-gold not-italic" style={{ fontStyle: 'italic' }}>Activos</em><br />
              Inmobiliarios
            </h1>
            <p className="text-white/50 text-lg font-light leading-relaxed mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              De los Fundamentos a la Práctica
            </p>
            <p className="text-white/35 text-sm leading-relaxed mb-10 max-w-xl">
              Curso completo sobre tokenización inmobiliaria en España. Aprende la tecnología, el marco legal, los modelos de negocio y los casos de uso reales del sector.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              {[
                { label: 'Módulos', value: '11' },
                { label: 'Lecciones', value: '52' },
                { label: 'Duración', value: '~8h' },
                { label: 'Certificado', value: 'Sí' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-light text-act-white">{stat.value}</div>
                  <div className="text-white/40 text-xs tracking-widest uppercase mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar if started */}
            {progress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 tracking-wide">Progreso del curso</span>
                  <span className="text-xs text-act-gold">{completedLessons} / {totalLessons} lecciones · {progress}%</span>
                </div>
                <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-act-burgundy progress-fill rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 bg-act-burgundy text-act-white px-8 py-4 text-sm tracking-[0.12em] uppercase font-medium hover:bg-act-burgundy-light transition-all duration-300"
            >
              {progress > 0 ? 'Continuar el Curso' : 'Comenzar el Curso'}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Modules overview */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-act-burgundy"></div>
          <h2 className="font-display text-2xl font-light text-white/70">Contenido del Curso</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.n}
              className="group border border-white/8 p-5 hover:border-white/16 transition-colors cursor-pointer"
              onClick={onStart}
            >
              <div className="text-act-burgundy font-mono text-xs tracking-[0.2em] mb-3 opacity-60">{mod.n}</div>
              <div className="font-display text-lg font-medium text-act-white mb-1.5 group-hover:text-act-gold transition-colors">{mod.title}</div>
              <div className="text-white/35 text-sm leading-relaxed">{mod.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-8 py-6 flex items-center justify-between">
        <ActivumLogo size="sm" />
        <p className="text-white/20 text-xs tracking-wide">© 2025 Activum · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
