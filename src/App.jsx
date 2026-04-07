import { useState, useEffect } from 'react'
import { getSession, logout, loadProgress, saveProgress } from './auth'
import { courseData } from './data/courseData'
import { catalogData } from './data/catalogData'
import AcademyLanding from './components/AcademyLanding'
import CourseLayout from './components/CourseLayout'
import AuthModal from './components/AuthModal'

export default function App() {
  const [user, setUser] = useState(() => getSession())
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'register'
  const [activeCourse, setActiveCourse] = useState(null) // courseId string or null

  // Per-user, per-course progress
  const getProgress = () => user ? loadProgress(user.userId, 'tokenizacion-inmobiliaria') : { completedLessons:[], completedQuizzes:{}, quizScores:{} }
  const [progress, setProgress] = useState(getProgress)

  // Reload progress whenever user changes
  useEffect(() => { setProgress(getProgress()) }, [user?.userId])

  const persistProgress = (next) => {
    setProgress(next)
    if (user) saveProgress(user.userId, 'tokenizacion-inmobiliaria', next)
  }

  const [activeLesson, setActiveLesson] = useState(null)
  const [activeQuiz, setActiveQuiz] = useState(null)

  const totalLessons = courseData.modules.reduce((a,m) => a + m.lessons.length, 0)
  const overallProgress = Math.round(
    ((progress.completedLessons.length + Object.keys(progress.completedQuizzes).length) /
    (totalLessons + courseData.modules.length)) * 100
  )

  const handleEnterCourse = (courseId) => {
    if (!user) { setAuthModal('register'); return }
    setActiveCourse(courseId)
    // Resume from first incomplete lesson
    for (const mod of courseData.modules) {
      for (const lesson of mod.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          setActiveLesson({ moduleId: mod.id, lessonId: lesson.id })
          setActiveQuiz(null)
          return
        }
      }
    }
    setActiveLesson(null); setActiveQuiz(null)
  }

  const handleLogout = () => {
    logout(); setUser(null); setActiveCourse(null)
    setProgress({ completedLessons:[], completedQuizzes:{}, quizScores:{} })
  }

  // Build progress map for catalog display
  const userProgressMap = user ? {
    'tokenizacion-inmobiliaria': progress
  } : {}

  if (activeCourse) {
    return (
      <CourseLayout
        courseData={courseData}
        progress={progress}
        activeLesson={activeLesson}
        activeQuiz={activeQuiz}
        overallProgress={overallProgress}
        totalLessons={totalLessons}
        completedCount={progress.completedLessons.length}
        user={user}
        onSelectLesson={(mid, lid) => { setActiveLesson({ moduleId:mid, lessonId:lid }); setActiveQuiz(null) }}
        onSelectQuiz={(mid) => { setActiveQuiz(mid); setActiveLesson(null) }}
        onCompleteLesson={(id) => {
          const next = { ...progress, completedLessons: progress.completedLessons.includes(id) ? progress.completedLessons : [...progress.completedLessons, id] }
          persistProgress(next)
        }}
        onCompleteQuiz={(mid, score) => {
          const next = { ...progress, completedQuizzes: { ...progress.completedQuizzes, [mid]: true }, quizScores: { ...progress.quizScores, [mid]: score } }
          persistProgress(next)
        }}
        onGoHome={() => setActiveCourse(null)}
        onReset={() => persistProgress({ completedLessons:[], completedQuizzes:{}, quizScores:{} })}
      />
    )
  }

  return (
    <>
      <AcademyLanding
        user={user}
        userProgressMap={userProgressMap}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        onEnterCourse={handleEnterCourse}
        onLogout={handleLogout}
      />
      {authModal && (
        <AuthModal
          initialMode={authModal}
          onSuccess={(u) => { setUser(u); setAuthModal(null) }}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  )
}
