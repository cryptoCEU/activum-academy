import { useState } from 'react'
import Sidebar from './Sidebar'
import LessonView from './LessonView'
import QuizView from './QuizView'
import Certificate from './Certificate'
import ActivumLogo from './ActivumLogo'

export default function CourseLayout({ courseData, progress, activeLesson, activeQuiz, overallProgress, totalLessons, completedCount, onSelectLesson, onSelectQuiz, onCompleteLesson, onCompleteQuiz, onGoHome, onReset, user }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showCert, setShowCert] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isCourseComplete = completedCount >= totalLessons && Object.keys(progress.completedQuizzes).length >= courseData.modules.length

  const currentModule = activeLesson
    ? courseData.modules.find(m => m.id === activeLesson.moduleId)
    : activeQuiz != null ? courseData.modules.find(m => m.id === activeQuiz) : null
  const currentLesson = activeLesson && currentModule
    ? currentModule.lessons.find(l => l.id === activeLesson.lessonId) : null

  const getNext = () => {
    if (activeLesson) {
      const mod = courseData.modules.find(m => m.id === activeLesson.moduleId)
      const idx = mod.lessons.findIndex(l => l.id === activeLesson.lessonId)
      onCompleteLesson(activeLesson.lessonId)
      if (idx < mod.lessons.length - 1) { onSelectLesson(mod.id, mod.lessons[idx + 1].id) }
      else { onSelectQuiz(mod.id) }
    } else if (activeQuiz != null) {
      const modIdx = courseData.modules.findIndex(m => m.id === activeQuiz)
      if (modIdx < courseData.modules.length - 1) {
        const next = courseData.modules[modIdx + 1]
        onSelectLesson(next.id, next.lessons[0].id)
      } else { setShowCert(true) }
    }
  }

  if (showCert) {
    return (
      <div className="h-screen flex flex-col bg-act-white">
        <header className="flex-shrink-0 border-b border-act-beige1 px-6 py-4 flex items-center justify-between bg-act-white">
          <button onClick={onGoHome} className="hover:opacity-70 transition-opacity"><ActivumLogo size="sm" /></button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-600 font-medium">Curso completado</span>
            <button onClick={() => setShowCert(false)} className="text-xs text-act-beige3 hover:text-act-black transition-colors">Volver al curso</button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <Certificate progress={progress} user={user} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-act-white overflow-hidden">
      {/* Mobile header */}
      <header className="flex-shrink-0 border-b border-act-beige1 px-4 py-3 flex items-center justify-between lg:hidden bg-act-white">
        <button onClick={onGoHome}><ActivumLogo size="sm" /></button>
        <button onClick={() => setMobileOpen(v => !v)} className="text-act-beige3 hover:text-act-black transition-colors p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {mobileOpen && <div className="fixed inset-0 bg-act-black/30 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />}

        <div className={`fixed inset-y-0 left-0 z-30 lg:relative lg:z-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <Sidebar courseData={courseData} progress={progress} activeLesson={activeLesson} activeQuiz={activeQuiz}
            overallProgress={overallProgress}
            onSelectLesson={(m,l) => { onSelectLesson(m,l); setMobileOpen(false) }}
            onSelectQuiz={(m) => { onSelectQuiz(m); setMobileOpen(false) }}
            onGoHome={onGoHome} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex-shrink-0 hidden lg:flex items-center justify-between border-b border-act-beige1 px-6 py-3 bg-act-white">
            <button onClick={onGoHome} className="text-xs text-act-beige3 hover:text-act-black transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Catalogo
            </button>
            <div className="flex items-center gap-5">
              {user && <span className="text-xs text-act-beige3">{user.name}</span>}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1 bg-act-beige2 rounded-full overflow-hidden">
                  <div className="h-full bg-act-burg progress-fill rounded-full" style={{ width: `${overallProgress}%` }} />
                </div>
                <span className="text-xs text-act-burg font-medium">{overallProgress}%</span>
              </div>
              {isCourseComplete && (
                <button onClick={() => setShowCert(true)}
                  className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg/5 transition-colors font-medium"
                  style={{ borderRadius: '2px' }}>
                  Ver certificado
                </button>
              )}
              <button onClick={() => { if (window.confirm('Resetear el progreso de este curso?')) onReset() }}
                className="text-xs text-act-beige3 hover:text-act-black/60 transition-colors">Resetear</button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {currentLesson && currentModule ? (
              <LessonView module={currentModule} lesson={currentLesson}
                isComplete={progress.completedLessons.includes(currentLesson.id)}
                onComplete={onCompleteLesson} onNext={getNext} />
            ) : currentModule && activeQuiz != null ? (
              <QuizView module={currentModule} quizScore={progress.quizScores?.[activeQuiz]}
                onComplete={onCompleteQuiz} onNext={getNext} />
            ) : (
              <WelcomePanel courseData={courseData} progress={progress} overallProgress={overallProgress}
                completedCount={completedCount} totalLessons={totalLessons}
                onSelectLesson={onSelectLesson} isCourseComplete={isCourseComplete}
                onShowCert={() => setShowCert(true)} user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WelcomePanel({ courseData, progress, overallProgress, completedCount, totalLessons, onSelectLesson, isCourseComplete, onShowCert, user }) {
  const nextLesson = (() => {
    for (const mod of courseData.modules) {
      for (const l of mod.lessons) {
        if (!progress.completedLessons.includes(l.id)) return { mod, lesson: l }
      }
    }
    return null
  })()
  const avgScore = (() => {
    const s = Object.values(progress.quizScores || {})
    return s.length ? Math.round(s.reduce((a,b)=>a+b,0)/s.length) : null
  })()

  return (
    <div className="h-full overflow-y-auto bg-act-white px-8 py-10 animate-fade-in">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-6 bg-act-burg"></div>
          <span className="text-[10px] text-act-burg tracking-[0.2em] uppercase font-semibold">Tokenizacion Inmobiliaria</span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-act-black mb-1">
          {overallProgress === 0 ? `Bienvenido, ${user?.name?.split(' ')[0] || ''}` : `Continua donde lo dejaste`}
        </h2>
        <p className="text-act-beige3 text-sm mb-8">
          {overallProgress === 0
            ? 'Selecciona una leccion del panel izquierdo para comenzar.'
            : `Has completado ${completedCount} de ${totalLessons} lecciones.`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Progreso', value: `${overallProgress}%` },
            { label: 'Lecciones', value: `${completedCount}/${totalLessons}` },
            { label: 'Quizzes', value: `${Object.keys(progress.completedQuizzes).length}/${courseData.modules.length}` },
            { label: 'Puntuacion media', value: avgScore != null ? `${avgScore}%` : '—' },
          ].map(s => (
            <div key={s.label} className="border border-act-beige2 bg-act-beige1/40 p-4" style={{ borderRadius: '2px' }}>
              <div className="text-act-beige3 text-[10px] tracking-wide uppercase font-medium mb-1">{s.label}</div>
              <div className="font-display text-2xl font-light text-act-black">{s.value}</div>
            </div>
          ))}
        </div>

        {nextLesson && (
          <div className="mb-5">
            <div className="text-[10px] text-act-beige3 tracking-[0.15em] uppercase font-medium mb-2">Siguiente leccion</div>
            <button onClick={() => onSelectLesson(nextLesson.mod.id, nextLesson.lesson.id)}
              className="group w-full flex items-center gap-4 border border-act-beige2 bg-act-white p-4 hover:border-act-burg/40 transition-all text-left"
              style={{ borderRadius: '2px' }}>
              <div className="flex-1">
                <div className="text-[10px] text-act-beige3 mb-0.5 font-medium uppercase tracking-wide">{nextLesson.mod.title}</div>
                <div className="text-sm text-act-black font-medium group-hover:text-act-burg transition-colors">{nextLesson.lesson.title}</div>
              </div>
              <svg className="w-4 h-4 text-act-beige3 group-hover:text-act-burg group-hover:translate-x-1 transition-all"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}

        {isCourseComplete && (
          <button onClick={onShowCert}
            className="w-full bg-act-burg text-white py-4 text-sm font-medium tracking-[0.1em] uppercase hover:bg-act-burg-l transition-colors flex items-center justify-center gap-3"
            style={{ borderRadius: '2px' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            Obtener mi Certificado
          </button>
        )}
      </div>
    </div>
  )
}
