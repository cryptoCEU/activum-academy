import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function StatusBadge({ status }) {
  const map = {
    published:   { label: 'Publicado',   cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    coming_soon: { label: 'Próximo',     cls: 'text-act-beige3 bg-act-beige1 border-act-beige2'  },
    draft:       { label: 'Borrador',    cls: 'text-amber-700 bg-amber-50 border-amber-200'       },
  }
  const { label, cls } = map[status] ?? map.draft
  return <span className={`text-[11px] font-medium px-2 py-0.5 border ${cls}`} style={{ borderRadius: '2px' }}>{label}</span>
}

function TypeBadge({ type }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 border ${
      type === 'internal'
        ? 'text-act-black bg-act-black/5 border-act-black/20'
        : 'text-act-burg bg-act-burg/5 border-act-burg/25'
    }`} style={{ borderRadius: '2px' }}>
      {type === 'internal' ? 'Interno' : 'Público'}
    </span>
  )
}

export default function Courses({ onNavigate }) {
  const [courses, setCourses]       = useState([])
  const [progress, setProgress]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [toggling, setToggling]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)  // course to confirm delete
  const [deleting, setDeleting]     = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    async function load() {
      const [cRes, pRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('progress').select('course_id, user_id'),
      ])
      setCourses(cRes.data ?? [])
      setProgress(pRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const toggleStatus = async (course) => {
    const next = course.status === 'published' ? 'coming_soon' : 'published'
    setToggling(course.id)
    const { error } = await supabase.from('courses').update({ status: next }).eq('id', course.id)
    if (!error) setCourses(cs => cs.map(c => c.id === course.id ? { ...c, status: next } : c))
    setToggling(null)
  }

  const toggleType = async (course) => {
    const next = course.type === 'public' ? 'internal' : 'public'
    const { error } = await supabase.from('courses').update({ type: next }).eq('id', course.id)
    if (!error) setCourses(cs => cs.map(c => c.id === course.id ? { ...c, type: next } : c))
  }

  const enrolledCount = (courseId) => new Set(progress.filter(p => p.course_id === courseId).map(p => p.user_id)).size

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    // Delete cascade: quiz_questions → lessons → modules → course_assignments → progress → course
    const id = deleteTarget.id
    const steps = [
      () => supabase.from('quiz_questions').delete().eq('course_id', id),
      () => supabase.from('lessons').delete().eq('course_id', id),
      () => supabase.from('modules').delete().eq('course_id', id),
      () => supabase.from('course_assignments').delete().eq('course_id', id),
      () => supabase.from('progress').delete().eq('course_id', id),
      () => supabase.from('courses').delete().eq('id', id),
    ]
    for (const step of steps) {
      const { error } = await step()
      if (error) { setDeleteError(error.message); setDeleting(false); return }
    }
    setCourses(cs => cs.filter(c => c.id !== id))
    setDeleteTarget(null)
    setDeleting(false)
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando cursos...</span>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Cursos</h1>
          <p className="text-sm text-act-beige3">{courses.length} cursos en total</p>
        </div>
        <button
          onClick={() => onNavigate('ai-generator')}
          className="flex items-center gap-2 bg-act-burg text-white px-5 py-2.5 text-sm font-medium hover:bg-act-burg-l transition-colors"
          style={{ borderRadius: '2px' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Nuevo curso con IA
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="border border-act-beige2 bg-act-white p-16 text-center" style={{ borderRadius: '2px' }}>
          <p className="text-act-beige3 text-sm mb-4">No hay cursos en la base de datos.</p>
          <p className="text-xs text-act-beige3 mb-6">Crea tu primer curso con el Generador IA o ejecuta el script de migración para importar los cursos existentes.</p>
          <button
            onClick={() => onNavigate('ai-generator')}
            className="bg-act-burg text-white px-6 py-2.5 text-sm font-medium hover:bg-act-burg-l transition-colors"
            style={{ borderRadius: '2px' }}
          >Crear con IA</button>
        </div>
      ) : (
        <div className="border border-act-beige2 overflow-x-auto" style={{ borderRadius: '2px' }}>
          <table className="w-full min-w-[780px]">
            <thead className="bg-act-beige1">
              <tr>
                {['Curso', 'Tipo', 'Estado', 'Módulos', 'Lecciones', 'Inscritos', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-[11px] font-medium text-act-beige3 tracking-widest uppercase py-3 px-4 border-b border-act-beige2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-act-beige1/40 transition-colors">
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <div className="font-medium text-act-black text-sm">{course.title}</div>
                    <div className="text-xs text-act-beige3 mt-0.5">{course.category} · {course.duration}</div>
                  </td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <button onClick={() => toggleType(course)}>
                      <TypeBadge type={course.type} />
                    </button>
                  </td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <button
                      onClick={() => toggleStatus(course)}
                      disabled={toggling === course.id}
                      className="disabled:opacity-50 transition-opacity"
                    >
                      <StatusBadge status={course.status} />
                    </button>
                  </td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{course.total_modules}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{course.total_lessons}</td>
                  <td className="py-3 px-4 border-b border-act-beige1 text-sm text-act-black">{enrolledCount(course.id)}</td>
                  <td className="py-3 px-4 border-b border-act-beige1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('course-editor', { courseId: course.id })}
                        className="text-xs text-act-burg border border-act-burg/30 px-3 py-1.5 hover:bg-act-burg hover:text-white transition-colors"
                        style={{ borderRadius: '2px' }}
                      >Editar</button>
                      <button
                        onClick={() => { setDeleteTarget(course); setDeleteError(null) }}
                        className="text-xs text-act-beige3 border border-act-beige2 px-3 py-1.5 hover:border-red-300 hover:text-red-600 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >Borrar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-act-black/40">
          <div className="bg-act-white border border-act-beige2 p-6 max-w-sm w-full mx-4 space-y-4" style={{ borderRadius: '2px' }}>
            <h2 className="font-display text-lg font-semibold text-act-black">¿Borrar curso?</h2>
            <p className="text-sm text-act-black/70">
              Se eliminará <span className="font-medium text-act-black">"{deleteTarget.title}"</span> junto con todos sus módulos, lecciones, quizzes, asignaciones y registros de progreso. Esta acción no se puede deshacer.
            </p>
            {deleteError && (
              <p className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2" style={{ borderRadius: '2px' }}>{deleteError}</p>
            )}
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null) }}
                disabled={deleting}
                className="px-4 py-2 text-sm border border-act-beige2 text-act-black hover:bg-act-beige1 transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >Cancelar</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >{deleting ? 'Borrando…' : 'Sí, borrar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
