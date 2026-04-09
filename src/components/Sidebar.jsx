import { useState } from 'react'
import ActivumLogo from './ActivumLogo'

export default function Sidebar({ courseData, progress, activeLesson, activeQuiz, overallProgress, onSelectLesson, onSelectQuiz, onGoHome, collapsed, setCollapsed }) {
  const [expanded, setExpanded] = useState(() => {
    const init = {}
    if (activeLesson) init[activeLesson.moduleId] = true
    if (activeQuiz != null) init[activeQuiz] = true
    return init
  })
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))
  const isDone = (id) => progress.completedLessons.includes(id)
  const isQuizDone = (id) => !!progress.completedQuizzes[id]
  const isModuleLocked = (modIdx) => {
    if (modIdx === 0) return false
    const prev = courseData.modules[modIdx - 1]
    const allLessonsDone = prev.lessons.every(l => progress.completedLessons.includes(l.id))
    const quizDone = !!progress.completedQuizzes?.[prev.id]
    return !allLessonsDone || !quizDone
  }

  return (
    <div className={`flex flex-col h-full bg-act-white border-r border-act-beige1 transition-all duration-300 ${collapsed ? 'w-14' : 'w-72'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3.5 border-b border-act-beige1">
        {!collapsed && (
          <button onClick={onGoHome} className="hover:opacity-70 transition-opacity pl-1">
            <ActivumLogo size="sm" />
          </button>
        )}
        <button onClick={() => setCollapsed(c => !c)} className={`p-1.5 text-act-beige3 hover:text-act-black transition-colors ${collapsed ? 'mx-auto' : 'ml-auto'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>}
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-act-beige1 bg-act-beige1/40">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-act-beige3 font-medium">Progreso total</span>
            <span className="text-act-burg font-semibold">{overallProgress}%</span>
          </div>
          <div className="h-1 bg-act-beige2 rounded-full overflow-hidden">
            <div className="h-full bg-act-burg progress-fill rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      )}

      {/* Modules list */}
      <div className="flex-1 overflow-y-auto py-2">
        {courseData.modules.map((mod, modIdx) => {
          const isActiveMod = (activeLesson?.moduleId === mod.id) || (activeQuiz === mod.id)
          const modDone = mod.lessons.filter(l => isDone(l.id)).length
          const exp = expanded[mod.id]
          const locked = isModuleLocked(modIdx)

          if (collapsed) {
            return (
              <button key={mod.id} onClick={() => { if (!locked) { setCollapsed(false); toggle(mod.id) } }}
                className={`w-full flex justify-center py-2.5 transition-colors ${locked ? 'opacity-40 cursor-not-allowed' : isActiveMod ? 'text-act-burg' : 'text-act-beige3 hover:text-act-black'}`}
                title={locked ? 'Completa el módulo anterior primero' : `Modulo ${mod.id}: ${mod.title}`}>
                <span className="w-6 h-6 flex items-center justify-center border text-[10px] font-mono font-bold"
                  style={{ borderColor: isActiveMod ? '#8C1736' : '#D9C9B8', color: isActiveMod ? '#8C1736' : '#C4B09A', borderRadius: '2px' }}>
                  {locked ? '🔒' : String(mod.id).padStart(2,'0')}
                </span>
              </button>
            )
          }

          return (
            <div key={mod.id}>
              <button onClick={() => { if (!locked) toggle(mod.id) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors group ${locked ? 'opacity-50 cursor-not-allowed' : isActiveMod ? 'bg-act-beige1' : 'hover:bg-act-beige1/50'}`}>
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center border text-[9px] font-mono font-bold transition-colors ${
                  isActiveMod ? 'border-act-burg text-act-burg' : 'border-act-beige2 text-act-beige3'}`}
                  style={{ borderRadius: '2px' }}>
                  {String(mod.id).padStart(2,'0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate transition-colors ${isActiveMod ? 'text-act-black' : 'text-act-black/55 group-hover:text-act-black/80'}`}>
                    {mod.title}
                  </div>
                  <div className="text-[10px] text-act-beige3 mt-0.5">
                    {locked ? 'Completa el módulo anterior' : `${modDone}/${mod.lessons.length} lecciones`}
                  </div>
                </div>
                {locked ? (
                  <svg className="w-3.5 h-3.5 text-act-beige3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ) : (
                  <svg className={`w-3 h-3 text-act-beige3 flex-shrink-0 transition-transform ${exp ? 'rotate-90' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                )}
              </button>

              {exp && (
                <div className="border-l border-act-beige2 ml-6 animate-slide-in">
                  {mod.lessons.map(lesson => {
                    const isAct = activeLesson?.lessonId === lesson.id
                    const done = isDone(lesson.id)
                    return (
                      <button key={lesson.id} onClick={() => !locked && onSelectLesson(mod.id, lesson.id)} disabled={locked}
                        className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors group ${isAct ? 'bg-act-burg/8' : 'hover:bg-act-beige1/60'}`}>
                        <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[8px] transition-colors ${
                          done ? 'bg-act-burg border-act-burg text-white' :
                          isAct ? 'border-act-burg' : 'border-act-beige2'}`}>
                          {done && (
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </span>
                        <span className={`text-xs leading-snug flex-1 truncate transition-colors ${
                          isAct ? 'text-act-burg font-medium' : done ? 'text-act-black/40' : 'text-act-black/55 group-hover:text-act-black/80'}`}>
                          {lesson.title}
                        </span>
                        <span className="text-[10px] text-act-beige3 flex-shrink-0">{lesson.duration}</span>
                      </button>
                    )
                  })}
                  {/* Quiz row */}
                  <button onClick={() => !locked && onSelectQuiz(mod.id)} disabled={locked}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors group ${activeQuiz === mod.id ? 'bg-act-burg/8' : 'hover:bg-act-beige1/60'}`}>
                    <span className={`flex-shrink-0 w-4 h-4 border flex items-center justify-center text-[9px] font-bold transition-colors ${
                      isQuizDone(mod.id) ? 'bg-act-burg border-act-burg text-white' :
                      activeQuiz === mod.id ? 'border-act-burg text-act-burg' : 'border-act-beige2 text-act-beige3'}`}
                      style={{ borderRadius: '2px' }}>
                      {isQuizDone(mod.id) ? (
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : 'Q'}
                    </span>
                    <span className={`text-xs transition-colors ${
                      activeQuiz === mod.id ? 'text-act-burg font-medium' : isQuizDone(mod.id) ? 'text-act-black/40' : 'text-act-black/50 group-hover:text-act-black/75'}`}>
                      Quiz del modulo
                      {isQuizDone(mod.id) && progress.quizScores?.[mod.id] != null && (
                        <span className="ml-1 text-act-burg/60">({progress.quizScores[mod.id]}%)</span>
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
