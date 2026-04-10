import { useState, useMemo, useRef } from 'react'
import ActivumLogo from './ActivumLogo'
import { catalogData as defaultCatalog } from '../data/catalogData'

export default function AcademyLanding({ user, catalog = defaultCatalog, onLoginClick, onRegisterClick, onEnterCourse, onLogout, onOpenDashboard, userProgressMap }) {
  const [activeTopics, setActiveTopics] = useState([])
  const [statusFilter, setStatusFilter] = useState('published')
  const topicsScrollRef = useRef(null)
  const scrollTopics = (dir) => {
    topicsScrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  const allTopics = useMemo(() => {
    const set = new Set()
    catalog.forEach(c => (c.topics ?? []).forEach(t => set.add(t)))
    return [...set].sort()
  }, [catalog])

  const toggleTopic = (t) =>
    setActiveTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const filteredCatalog = useMemo(() => {
    let result = catalog.filter(c => c.status === statusFilter)
    if (activeTopics.length > 0)
      result = result.filter(c => activeTopics.every(t => (c.topics ?? []).includes(t)))
    return result
  }, [catalog, activeTopics, statusFilter])

  const publishedCount  = catalog.filter(c => c.status === 'published').length
  const comingSoonCount = catalog.filter(c => c.status === 'coming_soon').length

  return (
    <div className="min-h-screen bg-act-white text-act-black">
      {/* NAV */}
      <nav className="border-b border-act-beige1 bg-act-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <ActivumLogo size="md" />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => onOpenDashboard('cursos')}
                  className="text-sm text-act-beige3 hidden sm:block hover:text-act-black transition-colors"
                >
                  Hola, <span className="text-act-black font-medium underline-offset-2 hover:underline">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => onOpenDashboard('cursos')}
                  className="text-xs text-act-black/70 border border-act-beige2 px-4 py-2 hover:border-act-burg hover:text-act-burg transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  Mi cuenta
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-act-beige3 border border-act-beige2 px-4 py-2 hover:border-act-beige3 hover:text-act-black transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-sm text-act-black/60 hover:text-act-black transition-colors font-medium"
                >
                  Iniciar sesion
                </button>
                <button
                  onClick={onRegisterClick}
                  className="text-sm bg-act-black text-act-white px-5 py-2 hover:bg-act-burg transition-colors font-medium"
                  style={{ borderRadius: '2px' }}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="border-b border-act-beige1 bg-act-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-8 bg-act-burg"></div>
              <span className="text-xs text-act-burg tracking-[0.25em] uppercase font-medium">Formacion profesional</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.05] text-act-black mb-5">
              Formacion para<br/>
              el futuro del<br/>
              <span className="italic font-normal text-act-burg">Real Estate</span>
            </h1>
            <p className="text-act-beige3 text-base leading-relaxed mb-8 max-w-sm">
              Cursos especializados en PropTech, tokenizacion, inversion y gestion inmobiliaria.
              Aprende con casos reales del mercado espanol.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <button
                  onClick={() => onOpenDashboard('cursos')}
                  className="bg-act-burg text-act-white px-7 py-3.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  Ver mis cursos
                </button>
              ) : (
                <>
                  <button
                    onClick={onRegisterClick}
                    className="bg-act-burg text-act-white px-7 py-3.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    Empezar gratis
                  </button>
                  <button
                    onClick={onLoginClick}
                    className="border border-act-beige2 text-act-black/70 px-7 py-3.5 text-sm font-medium hover:border-act-black/40 hover:text-act-black transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    Ya tengo cuenta
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats / right panel */}
          <div className="hidden md:grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {[
              { label: 'Cursos disponibles', value: String(publishedCount), sub: `${comingSoonCount} proximos en camino` },
              { label: 'Horas de contenido', value: '30+', sub: 'y creciendo' },
              { label: 'Casos reales', value: '20+', sub: 'mercado espanol' },
              { label: 'Certificados', value: 'Si', sub: 'al completar cada curso' },
            ].map(s => (
              <div key={s.label} className="bg-act-beige1 border border-act-beige2 p-6" style={{ borderRadius: '2px' }}>
                <div className="font-display text-4xl font-light text-act-black mb-1">{s.value}</div>
                <div className="text-xs font-semibold text-act-black/80 tracking-wide mb-0.5">{s.label}</div>
                <div className="text-xs text-act-beige3">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES CATALOG */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6 bg-act-burg"></div>
              <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Catalogo</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-act-black">
              {statusFilter === 'published' ? 'Cursos disponibles' : 'Próximos cursos'}
            </h2>
          </div>
          <span className="text-sm text-act-beige3 hidden sm:block">{filteredCatalog.length} curso{filteredCatalog.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 mb-5">
          {[
            { id: 'published',   label: 'Disponibles' },
            { id: 'coming_soon', label: 'Próximamente' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setStatusFilter(id); setActiveTopics([]) }}
              className={`text-xs px-4 py-2 border font-medium transition-colors ${
                statusFilter === id
                  ? 'bg-act-burg text-act-white border-act-burg'
                  : 'bg-transparent text-act-black/60 border-act-beige2 hover:border-act-burg/40 hover:text-act-burg'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {label}
              <span className={`ml-1.5 text-[10px] ${statusFilter === id ? 'opacity-70' : 'text-act-beige3'}`}>
                {catalog.filter(c => c.status === id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Topic filter */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => scrollTopics(-1)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-act-beige2 text-act-beige3 hover:border-act-beige3 hover:text-act-black transition-colors"
            style={{ borderRadius: '2px' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>

          <div ref={topicsScrollRef} className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => setActiveTopics([])}
              className={`flex-shrink-0 text-xs px-3 py-1.5 border transition-colors font-medium tracking-wide ${
                activeTopics.length === 0
                  ? 'bg-act-black text-act-white border-act-black'
                  : 'bg-transparent text-act-beige3 border-act-beige2 hover:border-act-beige3 hover:text-act-black'
              }`}
              style={{ borderRadius: '2px' }}
            >
              Todos
            </button>
            {allTopics.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 border transition-colors ${
                  activeTopics.includes(t)
                    ? 'bg-act-burg text-act-white border-act-burg'
                    : 'bg-transparent text-act-black/60 border-act-beige2 hover:border-act-burg/40 hover:text-act-burg'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTopics(1)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-act-beige2 text-act-beige3 hover:border-act-beige3 hover:text-act-black transition-colors"
            style={{ borderRadius: '2px' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredCatalog.length === 0 && (
            <div className="col-span-2 py-12 text-center text-act-beige3 text-sm">
              {activeTopics.length > 0 ? 'No hay cursos con las etiquetas seleccionadas.' : 'No hay cursos en esta categoría.'}
            </div>
          )}
          {filteredCatalog.map((course, i) => {
            const progress = userProgressMap?.[course.id]
            const pct = progress ? Math.round(
              ((progress.completedLessons?.length || 0) + Object.keys(progress.completedQuizzes || {}).length) /
              ((course.lessons || 1) + (course.modules || 0)) * 100
            ) : 0
            const isPublished = course.status === 'published'

            return (
              <div
                key={course.id}
                className={`group border bg-act-white transition-all duration-300 overflow-hidden ${
                  isPublished
                    ? 'border-act-beige2 hover:border-act-beige3 shadow-card hover:shadow-card-hover cursor-pointer'
                    : 'border-act-beige1 opacity-70'
                }`}
                style={{ borderRadius: '2px', animationDelay: `${i * 0.07}s` }}
                onClick={() => isPublished && (user ? onEnterCourse(course.id) : onRegisterClick())}
              >
                {/* Top color bar */}
                <div className={`h-1 ${isPublished ? 'bg-act-burg' : 'bg-act-beige2'}`} />

                <div className="p-7">
                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-act-burg border border-act-burg/25 bg-act-burg/5 px-2.5 py-0.5 font-medium" style={{ borderRadius: '2px' }}>
                        {course.category}
                      </span>
                      <span className="text-xs text-act-beige3 border border-act-beige2 px-2.5 py-0.5" style={{ borderRadius: '2px' }}>
                        {course.level}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 ${
                      isPublished
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-act-beige3 bg-act-beige1 border border-act-beige2'
                    }`} style={{ borderRadius: '2px' }}>
                      {course.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display text-xl font-semibold leading-snug mb-2 transition-colors ${
                    isPublished ? 'text-act-black group-hover:text-act-burg' : 'text-act-black/60'
                  }`}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-act-beige3 mb-3 font-medium tracking-wide italic">{course.subtitle}</p>
                  <p className="text-sm text-act-black/55 leading-relaxed mb-5 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {course.topics.slice(0, 4).map(t => (
                      <span key={t} className="text-[11px] text-act-black/50 bg-act-beige1 px-2 py-0.5" style={{ borderRadius: '2px' }}>
                        {t}
                      </span>
                    ))}
                    {course.topics.length > 4 && (
                      <span className="text-[11px] text-act-beige3 px-2 py-0.5">+{course.topics.length - 4} mas</span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between border-t border-act-beige1 pt-4">
                    <div className="flex items-center gap-4">
                      {[
                        { label: course.modules + ' modulos' },
                        { label: course.lessons + ' lecciones' },
                        { label: course.duration },
                      ].map(s => (
                        <span key={s.label} className="text-xs text-act-beige3">{s.label}</span>
                      ))}
                    </div>

                    {/* Progress or CTA */}
                    {isPublished ? (
                      pct > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-act-beige2 rounded-full">
                            <div className="h-full bg-act-burg progress-fill rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-act-burg font-medium">{pct}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-act-burg font-medium group-hover:underline transition-all">
                          {user ? 'Comenzar' : 'Acceder'} &rarr;
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-act-beige3">Proximamente</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* WHY ACTIVUM ACADEMY */}
      <section className="border-t border-act-beige1 bg-act-beige1">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Contenido del mercado espanol',
                desc: 'Casos reales, regulacion espanola (CNMV, MiCA) y datos actualizados del mercado inmobiliario espanol.',
              },
              {
                title: 'Aprende a tu ritmo',
                desc: 'Accede cuando quieras desde cualquier dispositivo. Tu progreso se guarda automaticamente y puedes retomar donde lo dejaste.',
              },
              {
                title: 'Certificado oficial',
                desc: 'Al completar cada curso obtienes un certificado personalizado de Activum Academy que puedes compartir y descargar.',
              },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <div className="flex-shrink-0 w-1 bg-act-burg mt-1 h-6" style={{ borderRadius: '1px' }} />
                <div>
                  <h3 className="font-semibold text-act-black mb-2 text-sm tracking-wide">{f.title}</h3>
                  <p className="text-sm text-act-beige3 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      {!user && (
        <section className="border-t border-act-beige2 bg-act-black">
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-light text-act-white mb-2">
                Empieza hoy, gratis.
              </h2>
              <p className="text-act-beige3 text-sm">Crea tu cuenta en menos de un minuto y accede al primer curso sin coste.</p>
            </div>
            <button
              onClick={onRegisterClick}
              className="flex-shrink-0 bg-act-burg text-act-white px-8 py-4 text-sm font-medium tracking-[0.1em] uppercase hover:bg-act-burg-l transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Crear cuenta gratis
            </button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-act-beige2 bg-act-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <ActivumLogo size="sm" />
          <p className="text-xs text-act-beige3">© 2025 Activum · Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}
