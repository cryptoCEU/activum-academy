import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp, EMPTY_PROGRESS } from '../context/AppContext'
import CourseLayout from '../components/CourseLayout'
import { loadCourse } from '../data/courseLoader'

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate     = useNavigate()
  const { userWithRole, progressMap, persistProgress, ensureProgressLoaded } = useApp()

  const [activeCourseData, setActiveCourseData] = useState(null)
  const [activeLesson,     setActiveLesson]     = useState(null)
  const [activeQuiz,       setActiveQuiz]       = useState(null)
  const [loading,          setLoading]          = useState(true)

  useEffect(() => {
    setLoading(true)
    setActiveCourseData(null)

    async function init() {
      // Cargar datos del curso y progreso en paralelo
      const [data, loadedProgress] = await Promise.all([
        loadCourse(courseId),
        ensureProgressLoaded(courseId),
      ])

      if (!data) { navigate('/'); return }
      setActiveCourseData(data)

      // Primera lección incompleta
      const progress = loadedProgress ?? progressMap[courseId] ?? EMPTY_PROGRESS
      for (const mod of data.modules) {
        for (const lesson of mod.lessons) {
          if (!progress.completedLessons.includes(lesson.id)) {
            setActiveLesson({ moduleId: mod.id, lessonId: lesson.id })
            setActiveQuiz(null)
            setLoading(false)
            return
          }
        }
      }
      setActiveLesson(null)
      setActiveQuiz(null)
      setLoading(false)
    }

    init()
  }, [courseId])

  if (loading || !activeCourseData) return null

  const progress     = progressMap[courseId] ?? EMPTY_PROGRESS
  const totalLessons = activeCourseData.modules.reduce((a, m) => a + m.lessons.length, 0)
  const overallProgress = Math.round(
    ((progress.completedLessons.length + Object.keys(progress.completedQuizzes).length) /
    (totalLessons + activeCourseData.modules.length)) * 100
  )

  return (
    <CourseLayout
      courseData={activeCourseData}
      progress={progress}
      activeLesson={activeLesson}
      activeQuiz={activeQuiz}
      overallProgress={overallProgress}
      totalLessons={totalLessons}
      completedCount={progress.completedLessons.length}
      user={userWithRole}
      onSelectLesson={(mid, lid) => { setActiveLesson({ moduleId: mid, lessonId: lid }); setActiveQuiz(null) }}
      onSelectQuiz={(mid)        => { setActiveQuiz(mid); setActiveLesson(null) }}
      onCompleteLesson={(id) => {
        const next = {
          ...progress,
          completedLessons: progress.completedLessons.includes(id)
            ? progress.completedLessons
            : [...progress.completedLessons, id],
        }
        persistProgress(courseId, next)
      }}
      onCompleteQuiz={(mid, score) => {
        const next = {
          ...progress,
          completedQuizzes: { ...progress.completedQuizzes, [mid]: true },
          quizScores:       { ...progress.quizScores, [mid]: score },
        }
        persistProgress(courseId, next)
      }}
      onGoHome={() => navigate('/')}
      onReset={() => persistProgress(courseId, EMPTY_PROGRESS)}
    />
  )
}
