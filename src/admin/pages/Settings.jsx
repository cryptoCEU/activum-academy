import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function Settings() {
  const [courseWeight, setCourseWeight] = useState(300)
  const [quizWeight,   setQuizWeight]   = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    supabase.from('settings').select('key, value').in('key', ['ranking_course_weight', 'ranking_quiz_weight'])
      .then(({ data }) => {
        if (data) {
          data.forEach(({ key, value }) => {
            if (key === 'ranking_course_weight') setCourseWeight(Number(value))
            if (key === 'ranking_quiz_weight')   setQuizWeight(Number(value))
          })
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true); setFeedback(null)
    const updates = [
      supabase.from('settings').upsert({ key: 'ranking_course_weight', value: String(courseWeight) }, { onConflict: 'key' }),
      supabase.from('settings').upsert({ key: 'ranking_quiz_weight',   value: String(quizWeight)   }, { onConflict: 'key' }),
    ]
    const results = await Promise.all(updates)
    const err = results.find(r => r.error)
    setSaving(false)
    setFeedback(err ? { type: 'error', text: err.error.message } : { type: 'ok', text: 'Configuración guardada.' })
    setTimeout(() => setFeedback(null), 3000)
  }

  const exampleScore = (courses, avgQuiz) =>
    Math.round(courses * courseWeight + avgQuiz * quizWeight)

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

      {/* Ranking weights */}
      <div className="border border-act-beige2 bg-act-white p-6 space-y-6" style={{ borderRadius: '2px' }}>
        <div className="flex items-center gap-3">
          <div className="h-px w-5 bg-act-burg" />
          <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Fórmula del ranking</span>
        </div>

        <div className="bg-act-beige1 px-4 py-3 font-mono text-sm text-act-black" style={{ borderRadius: '2px' }}>
          Score = cursos_completados × <span className="text-act-burg font-bold">{courseWeight}</span>
          {' '}+ media_quizzes × <span className="text-act-burg font-bold">{quizWeight}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">
              Peso por curso completado
            </label>
            <input
              type="number" min="0" max="10000" value={courseWeight}
              onChange={e => setCourseWeight(Number(e.target.value))}
              className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg"
              style={{ borderRadius: '2px' }}
            />
            <p className="text-[11px] text-act-beige3 mt-1">Puntos que suma cada curso completado</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">
              Peso de la media de quizzes
            </label>
            <input
              type="number" min="0" max="100" step="0.1" value={quizWeight}
              onChange={e => setQuizWeight(Number(e.target.value))}
              className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg"
              style={{ borderRadius: '2px' }}
            />
            <p className="text-[11px] text-act-beige3 mt-1">Multiplicador de la nota media (0–100)</p>
          </div>
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs font-medium text-act-black/50 tracking-widest uppercase mb-2">Ejemplos con la fórmula actual</p>
          <div className="space-y-1.5">
            {[
              { label: '1 curso completado, 85% de media en quizzes', courses: 1, quiz: 85 },
              { label: '3 cursos completados, 90% de media en quizzes', courses: 3, quiz: 90 },
              { label: '5 cursos completados, 75% de media en quizzes', courses: 5, quiz: 75 },
            ].map(ex => (
              <div key={ex.label} className="flex items-center justify-between text-xs border border-act-beige1 px-3 py-2 bg-act-beige1/30" style={{ borderRadius: '2px' }}>
                <span className="text-act-black/60">{ex.label}</span>
                <span className="font-medium text-act-burg ml-4 flex-shrink-0">{exampleScore(ex.courses, ex.quiz).toLocaleString('es-ES')} pts</span>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  )
}
