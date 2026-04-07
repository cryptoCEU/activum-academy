import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

// ── Shared UI ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-5 bg-act-burg flex-shrink-0" />
      <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">{children}</span>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">{label}</label>}
      <input {...props}
        className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
        style={{ borderRadius: '2px' }} />
    </div>
  )
}

function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">{label}</label>}
      <textarea {...props}
        className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3 resize-none"
        style={{ borderRadius: '2px' }} />
    </div>
  )
}

function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">{label}</label>}
      <select {...props}
        className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg"
        style={{ borderRadius: '2px' }}>
        {children}
      </select>
    </div>
  )
}

function Btn({ variant = 'primary', size = 'sm', disabled, children, ...props }) {
  const base = 'inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary:   'bg-act-burg text-white hover:bg-act-burg-l',
    secondary: 'border border-act-black text-act-black hover:bg-act-black hover:text-white',
    ghost:     'border border-act-beige2 text-act-black/70 hover:border-act-black/40 hover:text-act-black',
    danger:    'border border-red-200 text-red-600 hover:bg-red-50',
  }
  return <button disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]}`} style={{ borderRadius: '2px' }} {...props}>{children}</button>
}

function Alert({ type, children }) {
  const cls = { success: 'text-emerald-700 bg-emerald-50 border-emerald-200', error: 'text-act-burg bg-red-50 border-red-100' }[type]
  return <div className={`text-xs border px-3 py-2.5 ${cls}`} style={{ borderRadius: '2px' }}>{children}</div>
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconUp    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
const IconDown  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
const IconEdit  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
const IconTrash = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
const IconPlus  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
const IconChev  = ({ open }) => <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>

// ── QuizEditor (inline per module) ────────────────────────────────────────────

function QuizEditor({ moduleId, courseId, questions: initial, onUpdate }) {
  const [questions, setQuestions] = useState(initial ?? [])
  const [saving, setSaving]       = useState(false)

  const updateQ = (i, field, val) =>
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: val } : q))

  const updateOption = (qi, oi, val) =>
    setQuestions(qs => qs.map((q, idx) => idx !== qi ? q : { ...q, options: q.options.map((o, oidx) => oidx === oi ? val : o) }))

  const addQuestion = () =>
    setQuestions(qs => [...qs, { id: null, question: '', options: ['', '', '', ''], correct_answer: 0, position: qs.length }])

  const removeQuestion = async (i) => {
    const q = questions[i]
    if (q.id) await supabase.from('quiz_questions').delete().eq('id', q.id)
    setQuestions(qs => qs.filter((_, idx) => idx !== i).map((q, idx) => ({ ...q, position: idx })))
  }

  const saveQuizzes = async () => {
    setSaving(true)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const payload = { module_id: moduleId, course_id: courseId, question: q.question, options: q.options, correct_answer: q.correct_answer, position: i }
      if (q.id) {
        await supabase.from('quiz_questions').update(payload).eq('id', q.id)
      } else {
        const { data } = await supabase.from('quiz_questions').insert(payload).select('id').single()
        if (data) setQuestions(qs => qs.map((qq, idx) => idx === i ? { ...qq, id: data.id } : qq))
      }
    }
    setSaving(false)
    onUpdate?.(questions)
  }

  return (
    <div className="space-y-3 pt-2">
      {questions.map((q, qi) => (
        <div key={qi} className="border border-act-beige2 p-4 space-y-2" style={{ borderRadius: '2px' }}>
          <div className="flex items-start gap-2">
            <span className="text-xs text-act-beige3 mt-2.5 flex-shrink-0">P{qi + 1}</span>
            <textarea value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)}
              placeholder="Escribe la pregunta..."
              rows={2} className="flex-1 border border-act-beige2 bg-act-white text-sm px-3 py-2 focus:outline-none focus:border-act-burg resize-none"
              style={{ borderRadius: '2px' }} />
            <button onClick={() => removeQuestion(qi)} className="text-act-beige3 hover:text-red-500 transition-colors mt-1">
              <IconTrash />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pl-5">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-1.5">
                <input type="radio" name={`correct-${qi}`} checked={q.correct_answer === oi}
                  onChange={() => updateQ(qi, 'correct_answer', oi)}
                  className="accent-act-burg flex-shrink-0" />
                <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                  placeholder={`Opción ${String.fromCharCode(65 + oi)}`}
                  className="flex-1 border border-act-beige1 bg-act-white text-xs px-2 py-1.5 focus:outline-none focus:border-act-burg"
                  style={{ borderRadius: '2px' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Btn variant="ghost" onClick={addQuestion}><IconPlus />Añadir pregunta</Btn>
        {questions.length > 0 && (
          <Btn variant="primary" disabled={saving} onClick={saveQuizzes}>{saving ? 'Guardando…' : 'Guardar quiz'}</Btn>
        )}
      </div>
    </div>
  )
}

// ── ModuleRow ─────────────────────────────────────────────────────────────────

function ModuleRow({ mod, lessons, quizQuestions, isFirst, isLast, courseId, onNavigateLesson, onMove, onDelete, onRename, onLessonAdded, onLessonDeleted }) {
  const [open,    setOpen]    = useState(false)
  const [tab,     setTab]     = useState('lessons')   // lessons | quiz
  const [editing, setEditing] = useState(false)
  const [title,   setTitle]   = useState(mod.title)
  const [saving,  setSaving]  = useState(false)

  const saveTitle = async () => {
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('modules').update({ title: title.trim() }).eq('id', mod.id)
    setSaving(false)
    onRename(mod.id, title.trim())
    setEditing(false)
  }

  const addLesson = async () => {
    const position = lessons.length
    const id       = `${courseId}-${mod.position}-${position + 1}-${Date.now()}`
    const { data, error } = await supabase.from('lessons')
      .insert({ id, module_id: mod.id, course_id: courseId, title: 'Nueva lección', duration: '10 min', content: '', position })
      .select().single()
    if (!error && data) onLessonAdded(data)
  }

  const deleteLesson = async (lessonId) => {
    if (!confirm('¿Eliminar esta lección?')) return
    await supabase.from('lessons').delete().eq('id', lessonId)
    onLessonDeleted(lessonId)
  }

  return (
    <div className="border border-act-beige2" style={{ borderRadius: '2px' }}>
      {/* Module header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-act-beige1 border-b border-act-beige2">
        <span className="text-xs font-medium text-act-beige3 w-6 flex-shrink-0">{mod.position + 1}.</span>

        {editing ? (
          <input value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditing(false) }}
            autoFocus
            className="flex-1 border border-act-beige2 bg-act-white text-sm px-2 py-1 focus:outline-none focus:border-act-burg"
            style={{ borderRadius: '2px' }} />
        ) : (
          <span className="flex-1 text-sm font-medium text-act-black">{mod.title}</span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {editing ? (
            <>
              <Btn variant="primary" size="sm" disabled={saving} onClick={saveTitle}>{saving ? '…' : 'OK'}</Btn>
              <Btn variant="ghost" size="sm" onClick={() => { setEditing(false); setTitle(mod.title) }}>×</Btn>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="text-act-beige3 hover:text-act-black transition-colors p-1"><IconEdit /></button>
          )}
          <button onClick={() => onMove(mod.id, -1)} disabled={isFirst} className="text-act-beige3 hover:text-act-black transition-colors p-1 disabled:opacity-30"><IconUp /></button>
          <button onClick={() => onMove(mod.id, 1)} disabled={isLast} className="text-act-beige3 hover:text-act-black transition-colors p-1 disabled:opacity-30"><IconDown /></button>
          <button onClick={() => onDelete(mod.id)} className="text-act-beige3 hover:text-red-500 transition-colors p-1"><IconTrash /></button>
          <button onClick={() => setOpen(o => !o)} className="text-act-beige3 hover:text-act-black transition-colors p-1 ml-1">
            <IconChev open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4">
          {/* Tabs */}
          <div className="flex border-b border-act-beige2 mb-4">
            {[['lessons', `Lecciones (${lessons.length})`], ['quiz', `Quiz (${quizQuestions.length})`]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === id ? 'border-act-burg text-act-burg' : 'border-transparent text-act-beige3 hover:text-act-black'}`}
              >{label}</button>
            ))}
          </div>

          {tab === 'lessons' && (
            <div className="space-y-2">
              {lessons.length === 0 ? (
                <p className="text-sm text-act-beige3">Sin lecciones. Añade una.</p>
              ) : lessons.map((l, li) => (
                <div key={l.id} className="flex items-center gap-3 border border-act-beige1 px-3 py-2.5" style={{ borderRadius: '2px' }}>
                  <span className="text-xs text-act-beige3 w-5 flex-shrink-0">{li + 1}</span>
                  <span className="flex-1 text-sm text-act-black truncate">{l.title}</span>
                  <span className="text-xs text-act-beige3 flex-shrink-0">{l.duration}</span>
                  <div className="flex gap-1">
                    <Btn variant="ghost" size="sm" onClick={() => onNavigateLesson(l.id, mod.id)}>
                      <IconEdit />Editar
                    </Btn>
                    <button onClick={() => deleteLesson(l.id)} className="text-act-beige3 hover:text-red-500 transition-colors p-1.5"><IconTrash /></button>
                  </div>
                </div>
              ))}
              <Btn variant="ghost" size="sm" onClick={addLesson}><IconPlus />Añadir lección</Btn>
            </div>
          )}

          {tab === 'quiz' && (
            <QuizEditor moduleId={mod.id} courseId={courseId} questions={quizQuestions} />
          )}
        </div>
      )}
    </div>
  )
}

// ── CourseEditor ──────────────────────────────────────────────────────────────

export default function CourseEditor({ courseId, onNavigate }) {
  const [course,  setCourse]  = useState(null)
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [fb,      setFb]      = useState(null)

  // Form state mirrors course fields
  const [form, setForm] = useState({})
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const msg = (type, text) => { setFb({ type, text }); setTimeout(() => setFb(null), 4000) }

  useEffect(() => {
    if (!courseId) return
    async function load() {
      const [cRes, mRes, lRes, qRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).single(),
        supabase.from('modules').select('*').eq('course_id', courseId).order('position'),
        supabase.from('lessons').select('id, module_id, title, duration, position').eq('course_id', courseId).order('position'),
        supabase.from('quiz_questions').select('*').eq('course_id', courseId).order('position'),
      ])
      setCourse(cRes.data)
      setForm(cRes.data ?? {})
      setModules(mRes.data ?? [])
      setLessons(lRes.data ?? [])
      setQuizzes(qRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [courseId])

  const handleSaveMeta = async () => {
    setSaving(true)
    const { error } = await supabase.from('courses').update({
      title:         form.title,
      subtitle:      form.subtitle,
      description:   form.description,
      category:      form.category,
      level:         form.level,
      duration:      form.duration,
      status:        form.status,
      type:          form.type,
      badge:         form.badge,
      topics:        typeof form.topics === 'string'
                       ? form.topics.split(',').map(t => t.trim()).filter(Boolean)
                       : form.topics,
      updated_at:    new Date().toISOString(),
    }).eq('id', courseId)
    setSaving(false)
    if (error) msg('error', error.message)
    else msg('success', 'Curso guardado correctamente.')
  }

  const handleAddModule = async () => {
    const position = modules.length
    const { data, error } = await supabase.from('modules')
      .insert({ course_id: courseId, title: `Módulo ${position + 1}`, position })
      .select().single()
    if (!error && data) setModules(ms => [...ms, data])
  }

  const handleDeleteModule = async (modId) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return
    await supabase.from('modules').delete().eq('id', modId)
    setModules(ms => ms.filter(m => m.id !== modId).map((m, i) => ({ ...m, position: i })))
    setLessons(ls => ls.filter(l => l.module_id !== modId))
    setQuizzes(qs => qs.filter(q => q.module_id !== modId))
  }

  const handleMoveModule = async (modId, dir) => {
    const idx  = modules.findIndex(m => m.id === modId)
    const swap = idx + dir
    if (swap < 0 || swap >= modules.length) return

    const updated = modules.map((m, i) => {
      if (i === idx)  return { ...m, position: swap }
      if (i === swap) return { ...m, position: idx }
      return m
    }).sort((a, b) => a.position - b.position)

    setModules(updated)
    await supabase.from('modules').update({ position: swap }).eq('id', modId)
    await supabase.from('modules').update({ position: idx  }).eq('id', modules[swap].id)
  }

  const handleRenameModule = (modId, title) =>
    setModules(ms => ms.map(m => m.id === modId ? { ...m, title } : m))

  const handleLessonAdded   = (lesson) => setLessons(ls => [...ls, lesson])
  const handleLessonDeleted = (id)     => setLessons(ls => ls.filter(l => l.id !== id))

  if (!courseId) return (
    <div className="py-16 text-center text-act-beige3 text-sm">
      Selecciona un curso desde la lista de cursos.
    </div>
  )

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando curso...</span>
    </div>
  )

  const topicsStr = Array.isArray(form.topics) ? form.topics.join(', ') : (form.topics ?? '')

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('courses')}
          className="flex items-center gap-1.5 text-xs text-act-beige3 hover:text-act-black transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Cursos
        </button>
        <div className="h-px flex-1 bg-act-beige2" />
        <span className={`text-[11px] font-medium px-2 py-0.5 border ${
          form.status === 'published' ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
          : form.status === 'draft'   ? 'text-amber-700 bg-amber-50 border-amber-200'
          :                             'text-act-beige3 bg-act-beige1 border-act-beige2'
        }`} style={{ borderRadius: '2px' }}>
          {form.status === 'published' ? 'Publicado' : form.status === 'draft' ? 'Borrador' : 'Próximo'}
        </span>
      </div>

      <h1 className="font-display text-2xl font-semibold text-act-black -mt-4">{course?.title}</h1>

      {fb && <Alert type={fb.type}>{fb.text}</Alert>}

      {/* ── Metadata ── */}
      <div className="border border-act-beige2 bg-act-white p-6" style={{ borderRadius: '2px' }}>
        <SectionLabel>Metadatos del curso</SectionLabel>
        <div className="space-y-4">
          <Input label="Título" value={form.title ?? ''} onChange={e => setF('title', e.target.value)} placeholder="Título del curso" />
          <Input label="Subtítulo" value={form.subtitle ?? ''} onChange={e => setF('subtitle', e.target.value)} placeholder="Subtítulo descriptivo" />
          <Textarea label="Descripción" value={form.description ?? ''} onChange={e => setF('description', e.target.value)} rows={3} placeholder="Descripción para el catálogo" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Categoría" value={form.category ?? ''} onChange={e => setF('category', e.target.value)} placeholder="PropTech" />
            <Input label="Duración" value={form.duration ?? ''} onChange={e => setF('duration', e.target.value)} placeholder="8 horas" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select label="Nivel" value={form.level ?? 'Intermedio'} onChange={e => setF('level', e.target.value)}>
              {['Básico', 'Intermedio', 'Avanzado'].map(l => <option key={l}>{l}</option>)}
            </Select>
            <Select label="Estado" value={form.status ?? 'draft'} onChange={e => setF('status', e.target.value)}>
              <option value="published">Publicado</option>
              <option value="coming_soon">Próximo</option>
              <option value="draft">Borrador</option>
            </Select>
            <Select label="Tipo" value={form.type ?? 'public'} onChange={e => setF('type', e.target.value)}>
              <option value="public">Público</option>
              <option value="internal">Interno</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Badge" value={form.badge ?? ''} onChange={e => setF('badge', e.target.value)} placeholder="Nuevo, Actualizado…" />
            <Input label="Topics (separados por coma)" value={topicsStr} onChange={e => setF('topics', e.target.value)} placeholder="PropTech, Blockchain, CNMV" />
          </div>

          <div className="flex justify-end">
            <Btn variant="primary" size="md" disabled={saving} onClick={handleSaveMeta}>
              {saving ? 'Guardando…' : 'Guardar metadatos'}
            </Btn>
          </div>
        </div>
      </div>

      {/* ── Modules ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Módulos y lecciones</SectionLabel>
          <Btn variant="ghost" size="sm" onClick={handleAddModule}><IconPlus />Añadir módulo</Btn>
        </div>

        {modules.length === 0 ? (
          <div className="border border-dashed border-act-beige2 p-10 text-center text-act-beige3 text-sm" style={{ borderRadius: '2px' }}>
            Este curso no tiene módulos. Añade el primero.
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, idx) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
                lessons={lessons.filter(l => l.module_id === mod.id).sort((a, b) => a.position - b.position)}
                quizQuestions={quizzes.filter(q => q.module_id === mod.id)}
                isFirst={idx === 0}
                isLast={idx === modules.length - 1}
                courseId={courseId}
                onNavigateLesson={(lid, mid) => onNavigate('lesson-editor', { lessonId: lid, moduleId: mid, courseId })}
                onMove={handleMoveModule}
                onDelete={handleDeleteModule}
                onRename={handleRenameModule}
                onLessonAdded={handleLessonAdded}
                onLessonDeleted={handleLessonDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
