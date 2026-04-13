import { useEffect, useRef } from 'react'

function getEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1)
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
    if (u.hostname.includes('vimeo.com')) {
      const v = u.pathname.split('/').filter(Boolean).pop()
      return v ? `https://player.vimeo.com/video/${v}` : null
    }
  } catch {}
  return null
}

export default function LessonView({ module: mod, lesson, isComplete, onComplete, onNext }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTo(0, 0)

    // Init tabs
    el.querySelectorAll('.tabs').forEach(tabsEl => {
      const buttons = Array.from(tabsEl.querySelectorAll('.tab-btn'))
      const panels  = Array.from(tabsEl.querySelectorAll('.tab-panel'))
      if (!buttons.length) return
      // Activate first tab if none active yet
      if (!buttons.some(b => b.classList.contains('active'))) {
        buttons[0].classList.add('active')
        panels[0]?.classList.add('active')
      }
      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'))
          panels.forEach(p => p.classList.remove('active'))
          btn.classList.add('active')
          panels[i]?.classList.add('active')
        })
      })
    })
  }, [lesson.id])

  return (
    <div className="flex flex-col h-full bg-act-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-act-beige1 px-8 py-5 bg-act-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-act-burg tracking-[0.15em] uppercase">{mod.title}</span>
          <span className="text-act-beige2">/</span>
          <span className="text-[10px] text-act-beige3 tracking-wide">Leccion {lesson.id}</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-act-black leading-tight">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-2.5">
          <span className="text-act-beige3 text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {lesson.duration}
          </span>
          {isComplete && (
            <span className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Completada
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={ref} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-8 py-8 max-w-2xl animate-fade-in">
          {getEmbedUrl(lesson.video_url) && (
            <div className="mb-8 border border-act-beige2 overflow-hidden" style={{ borderRadius: '2px', aspectRatio: '16/9' }}>
              <iframe
                src={getEmbedUrl(lesson.video_url)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={lesson.title}
              />
            </div>
          )}
          <div className="lesson-prose" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex-shrink-0 border-t border-act-beige1 px-8 py-4 bg-act-white flex items-center justify-between">
        <div className="text-[11px] text-act-beige3 hidden sm:block">
          {mod.title} &middot; {lesson.id}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          {!isComplete && (
            <button onClick={() => onComplete(lesson.id)}
              className="flex items-center gap-2 text-xs text-act-black/50 border border-act-beige2 px-4 py-2 hover:border-act-black/30 hover:text-act-black transition-colors"
              style={{ borderRadius: '2px' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Marcar completada
            </button>
          )}
          <button onClick={onNext}
            className="flex items-center gap-2 text-xs bg-act-burg text-white px-5 py-2 hover:bg-act-burg-l transition-colors font-medium tracking-wide"
            style={{ borderRadius: '2px' }}>
            Siguiente
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
