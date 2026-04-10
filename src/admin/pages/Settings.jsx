import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function Settings() {
  const [quizWeight,    setQuizWeight]    = useState(1)
  const [courseWeights, setCourseWeights] = useState({})  // { courseId: number }
  const [courses,       setCourses]       = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    async function load() {
      const [settingsRes, coursesRes] = await Promise.all([
        supabase.from('settings').select('key, value'),
        supabase.from('courses').select('id, title, status').eq('status', 'published').order('created_at'),
      ])

      const settings = {}
      ;(settingsRes.data ?? []).forEach(({ key, value }) => { settings[key] = value })

      if (settings['ranking_quiz_weight'] != null)
        setQuizWeight(Number(settings['ranking_quiz_weight']))

      const published = coursesRes.data ?? []
      setCourses(published)

      const weights = {}
      published.forEach(c => {
        const key = `ranking_course_weight_${c.id}`
        weights[c.id] = settings[key] != null ? Number(settings[key]) : 300
      })
      setCourseWeights(weights)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true); setFeedback(null)

    const upserts = [
      supabase.from('settings').upsert({ key: 'ranking_quiz_weight', value: String(quizWeight) }, { onConflict: 'key' }),
      ...Object.entries(courseWeights).map(([courseId, w]) =>
        supabase.from('settings').upsert(
          { key: `ranking_course_weight_${courseId}`, value: String(w) },
          { onConflict: 'key' }
        )
      ),
    ]

    const results = await Promise.all(upserts)
    const err = results.find(r => r.error)
    setSaving(false)
    setFeedback(err ? { type: 'error', text: err.error.message } : { type: 'ok', text: 'Configuración guardada.' })
    setTimeout(() => setFeedback(null), 3000)
  }

  const totalExample = (completedIds, avgQuiz) => {
    const courseScore = completedIds.reduce((s, id) => s + (courseWeights[id] ?? 0), 0)
    return Math.round(courseScore + avgQuiz * quizWeight)
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando...</span>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Configuración</h1>
        <p className="text-sm text-act-beige3">Ajustes globales de la plataforma</p>
      </div>

      {/* Pesos por curso */}
      <div className="border border-act-beige2 bg-act-white p-6 space-y-6" style={{ borderRadius: '2px' }}>
        <div className="flex items-center gap-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Puntos por curso completado</span>
        </div>

        <p className="text-xs text-act-black/60 leading-relaxed">
          Asigna cuántos puntos suma cada curso al completarlo. Cursos más avanzados o de mayor valor pueden tener más peso.
        </p>

        <div className="space-y-3">
          {courses.length === 0 && (
            <p className="text-sm text-act-beige3">No hay cursos publicados.</p>
          )}
          {courses.map((course, i) => (
            <div key={course.id} className="flex items-center gap-4 border border-act-beige1 px-4 py-3 bg-act-beige1/30" style={{ borderRadius: '2px' }}>
              <span className="text-[10px] font-mono text-act-beige3 w-5 flex-shrink-0">{i + 1}</span>
              <span className="text-sm text-act-black flex-1 truncate">{course.title}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number" min="0" max="99999" step="10"
                  value={courseWeights[course.id] ?? 300}
                  onChange={e => setCourseWeights(p => ({ ...p, [course.id]: Number(e.target.value) }))}
                  className="w-24 border border-act-beige2 bg-act-white text-act-black px-3 py-1.5 text-sm text-right focus:outline-none focus:border-act-burg"
                  style={{ borderRadius: '2px' }}
                />
                <span className="text-xs text-act-beige3">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peso quiz */}
      <div className="border border-act-beige2 bg-act-white p-6 space-y-5" style={{ borderRadius: '2px' }}>
        <div className="flex items-center gap-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Peso de la media de quizzes</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-act-black/60 leading-relaxed">
              Multiplicador aplicado a la media de notas de los quizzes (0–100). Un valor de 1 suma directamente la media como puntos.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="number" min="0" max="100" step="0.1" value={quizWeight}
              onChange={e => setQuizWeight(Number(e.target.value))}
              className="w-24 border border-act-beige2 bg-act-white text-act-black px-3 py-1.5 text-sm text-right focus:outline-none focus:border-act-burg"
              style={{ borderRadius: '2px' }}
            />
            <span className="text-xs text-act-beige3">× media</span>
          </div>
        </div>
      </div>

      {/* Fórmula y ejemplos */}
      {courses.length > 0 && (
        <div className="border border-act-beige2 bg-act-white p-6 space-y-4" style={{ borderRadius: '2px' }}>
          <div className="flex items-center gap-3">
            <div className="h-px w-5 bg-act-burg" />
            <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Fórmula resultante</span>
          </div>

          <div className="bg-act-beige1 px-4 py-3 font-mono text-xs text-act-black leading-relaxed" style={{ borderRadius: '2px' }}>
            Score = Σ puntos_por_curso_completado + media_quizzes × <span className="text-act-burg font-bold">{quizWeight}</span>
          </div>

          <div>
            <p className="text-xs font-medium text-act-black/50 tracking-widest uppercase mb-2">Ejemplos con la configuración actual</p>
            <div className="space-y-1.5">
              {[
                { label: `Solo "${courses[0]?.title}", 85% quizzes`, ids: [courses[0]?.id], quiz: 85 },
                courses.length >= 2
                  ? { label: `"${courses[0]?.title}" + "${courses[1]?.title}", 90% quizzes`, ids: [courses[0]?.id, courses[1]?.id], quiz: 90 }
                  : null,
                courses.length >= 2
                  ? { label: `Todos los cursos, 75% quizzes`, ids: courses.map(c => c.id), quiz: 75 }
                  : null,
              ].filter(Boolean).map(ex => (
                <div key={ex.label} className="flex items-center justify-between text-xs border border-act-beige1 px-3 py-2 bg-act-beige1/30" style={{ borderRadius: '2px' }}>
                  <span className="text-act-black/60 truncate mr-4">{ex.label}</span>
                  <span className="font-medium text-act-burg flex-shrink-0">
                    {totalExample(ex.ids.filter(Boolean), ex.quiz).toLocaleString('es-ES')} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`text-xs border px-3 py-2.5 ${feedback.type === 'ok' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-act-burg bg-red-50 border-red-100'}`} style={{ borderRadius: '2px' }}>
          {feedback.text}
        </div>
      )}

      <button
        onClick={handleSave} disabled={saving}
        className="bg-act-burg text-white px-6 py-2.5 text-sm font-medium hover:bg-act-burg-l transition-colors disabled:opacity-50"
        style={{ borderRadius: '2px' }}
      >{saving ? 'Guardando…' : 'Guardar configuración'}</button>
    </div>
  )
}
