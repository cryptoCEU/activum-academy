import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { logout, loadProgress, saveProgress } from './auth'
import { courseData } from './data/courseData'
import { catalogData } from './data/catalogData'
import AcademyLanding from './components/AcademyLanding'
import CourseLayout from './components/CourseLayout'
import AuthModal from './components/AuthModal'

const EMPTY_PROGRESS = { completedLessons: [], completedQuizzes: {}, quizScores: {} }

function sessionFromSupabaseUser(u) {
  if (!u) return null
  return { userId: u.id, name: u.user_metadata?.name ?? u.email, email: u.email }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'register'
  const [activeCourse, setActiveCourse] = useState(null)
  const [progress, setProgress] = useState(EMPTY_PROGRESS)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeQuiz, setActiveQuiz] = useState(null)

  // Subscribe to Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user ?? null
      setUser(sessionFromSupabaseUser(u))
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionFromSupabaseUser(session?.user ?? null))
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load progress whenever user changes
  useEffect(() => {
    if (!user) { setProgress(EMPTY_PROGRESS); return }
    loadProgress(user.userId, 'tokenizacion-inmobiliaria').then(setProgress)
  }, [user?.userId])

  const persistProgress = async (next) => {
    setProgress(next)
    if (user) await saveProgress(user.userId, 'tokenizacion-inmobiliaria', next)
  }

  const totalLessons = courseData.modules.reduce((a, m) => a + m.lessons.length, 0)
  const overallProgress = Math.round(
    ((progress.completedLessons.length + Object.keys(progress.completedQuizzes).length) /
    (totalLessons + courseData.modules.length)) * 100
  )

  const handleEnterCourse = (courseId) => {
    if (!user) { setAuthModal('register'); return }
    setActiveCourse(courseId)
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

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setActiveCourse(null)
    setProgress(EMPTY_PROGRESS)
  }

  const userProgressMap = user ? { 'tokenizacion-inmobiliaria': progress } : {}

  // Wait for Supabase to resolve session before rendering
  if (!authReady) return null

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
        onSelectLesson={(mid, lid) => { setActiveLesson({ moduleId: mid, lessonId: lid }); setActiveQuiz(null) }}
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
        onReset={() => persistProgress(EMPTY_PROGRESS)}
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
