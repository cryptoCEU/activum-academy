import { useState, useRef } from 'react'
import { supabase } from '../../supabase'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// ── Helpers ───────────────────────────────────────────────────────────────────

async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      pages.push(content.items.map(item => item.str).join(' '))
    }
    return pages.join('\n')
  }

  if (ext === 'docx' || ext === 'doc') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }

  throw new Error('Formato no soportado. Usa PDF o DOCX.')
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function callClaude(systemPrompt, userPrompt, maxTokens = 4000, retries = 3) {
  const isDev = import.meta.env.DEV

  const body = JSON.stringify({
    model:      'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  })

  for (let attempt = 0; attempt <= retries; attempt++) {
    let res
    if (isDev) {
      // En desarrollo: llamada directa con browser access header
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) throw new Error('Falta VITE_ANTHROPIC_API_KEY en el archivo .env')
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':    apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body,
      })
    } else {
      // En producción: proxy serverless (evita CORS)
      res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    }

    // Retry on 529 (Overloaded) or 529-like transient errors
    if (res.status === 529 || res.status === 503 || res.status === 502) {
      if (attempt < retries) {
        const delay = (attempt + 1) * 8000  // 8s, 16s, 24s
        await new Promise(r => setTimeout(r, delay))
        continue
      }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
    }

    const data = await res.json()
    return data.content[0].text
  }
}

// ── Prompts ───────────────────────────────────────────────────────────────────

const STRUCTURE_SYSTEM = `Eres un experto en diseño instruccional y el sector inmobiliario español. Genera la estructura completa de un curso LMS en JSON estricto siguiendo exactamente este formato:
{
  "title": "Título del curso",
  "subtitle": "Subtítulo descriptivo",
  "description": "Descripción de 2-3 frases para el catálogo",
  "topics": ["tema1", "tema2", "tema3", "tema4"],
  "modules": [
    {
      "title": "Título del módulo",
      "lessons": [
        { "title": "Título de la lección", "duration": "12 min" }
      ],
      "quiz": {
        "questions": [
          {
            "question": "Pregunta del quiz",
            "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
            "correct_answer": 0
          }
        ]
      }
    }
  ]
}
Solo JSON puro, sin markdown, sin backticks, sin explicaciones.`

const LESSON_SYSTEM = `Genera el contenido HTML completo para una lección de un LMS inmobiliario profesional en español.

COMPONENTES DISPONIBLES — úsalos todos con frecuencia para crear lecciones variadas, visualmente ricas e interactivas:

1. TÍTULOS
<h2>Título de sección principal</h2>
<h3>Subtítulo de apartado</h3>

2. PÁRRAFO
<p>Texto explicativo detallado...</p>

3. LISTA
<ul><li>Elemento de lista</li><li>Otro elemento</li></ul>

4. CAJA DESTACADA (para ideas clave o resúmenes)
<div class="highlight-box"><p>Idea o concepto clave que el alumno debe recordar.</p></div>

5. ACORDEÓN DESPLEGABLE (para preguntas frecuentes, definiciones o conceptos que se amplían)
<details class="accordion"><summary>¿Cuál es la pregunta o título?</summary><div class="accordion-body"><p>Respuesta o contenido ampliado aquí.</p></div></details>
Puedes encadenar varios acordeones seguidos.

6. PESTAÑAS INTERACTIVAS (para comparar opciones, pros/contras, casos distintos)
<div class="tabs"><div class="tab-buttons"><button class="tab-btn">Opción A</button><button class="tab-btn">Opción B</button><button class="tab-btn">Opción C</button></div><div class="tab-panels"><div class="tab-panel"><p>Contenido de Opción A...</p></div><div class="tab-panel"><p>Contenido de Opción B...</p></div><div class="tab-panel"><p>Contenido de Opción C...</p></div></div></div>

7. CALLOUT — CONSEJO (burdeos)
<div class="callout callout-tip"><strong>Consejo profesional</strong><p>Texto del consejo aplicado al mercado inmobiliario.</p></div>

8. CALLOUT — ADVERTENCIA (ámbar)
<div class="callout callout-warning"><strong>Atención</strong><p>Riesgo o punto de atención importante.</p></div>

9. CALLOUT — INFORMACIÓN (azul)
<div class="callout callout-info"><strong>Dato clave</strong><p>Estadística o dato relevante del mercado.</p></div>

10. CALLOUT — ÉXITO (verde)
<div class="callout callout-success"><strong>Buena práctica</strong><p>Ejemplo de aplicación correcta.</p></div>

11. PASOS NUMERADOS (para procesos, metodologías o procedimientos)
<ol class="steps"><li class="step"><strong>Nombre del paso</strong><p>Descripción detallada de qué hacer en este paso.</p></li><li class="step"><strong>Siguiente paso</strong><p>Descripción...</p></li></ol>

12. DOS COLUMNAS (para comparar conceptos, pros/contras o dos perspectivas)
<div class="two-col"><div><h3>Concepto A</h3><p>Explicación...</p></div><div><h3>Concepto B</h3><p>Explicación...</p></div></div>

13. ESTADÍSTICAS / MÉTRICAS (para datos numéricos del mercado)
<div class="info-grid"><div class="info-card"><div class="card-title">Métrica</div><div class="card-value">42%</div></div><div class="info-card"><div class="card-title">Otra métrica</div><div class="card-value">€2.3M</div></div></div>

14. CITA O DATO DE IMPACTO
<blockquote class="quote-box"><p>"Texto de la cita o declaración relevante del sector."</p><cite>— Fuente, organismo o experto</cite></blockquote>

15. IMAGEN SUGERIDA (placeholder que el editor puede completar luego)
<figure class="lesson-figure"><figcaption>📸 Imagen sugerida: descripción específica de qué debería aparecer aquí (ej: "Infografía del proceso de tokenización de un activo inmobiliario")</figcaption></figure>

REGLAS:
- Contenido mínimo 800 palabras, profesional y detallado, con datos reales del mercado inmobiliario español donde aplique.
- Usa MÍNIMO 5 componentes diferentes por lección. Alterna entre tipos para crear ritmo visual.
- Los acordeones son ideales para FAQs y definiciones extensas que no deben ocupar todo el espacio.
- Las pestañas sirven para comparar opciones, antes/después, tipos de activos, etc.
- Los pasos numerados para procesos: due diligence, firma de escritura, tokenización, etc.
- Incluye 1-2 figuras con descripción sugerida de imagen.
- NO uses <html>, <body>, <head> ni <style>. Solo HTML del cuerpo del contenido.
- Solo HTML puro, sin markdown, sin backticks, sin comentarios, sin explicaciones fuera del HTML.`

// ── Sub-components ────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs font-medium text-act-black/50 tracking-widest uppercase">{label}</label>
        <span className="text-xs font-medium text-act-burg">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-act-burg h-1.5 rounded-full"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-act-beige3">{min}</span>
        <span className="text-[10px] text-act-beige3">{max}</span>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function inputCls() {
  return 'w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3'
}

function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-act-beige3">
        <span>{label}</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-1.5 bg-act-beige2" style={{ borderRadius: '1px' }}>
        <div className="h-full bg-act-burg transition-all duration-300" style={{ width: `${pct}%`, borderRadius: '1px' }} />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  title:            '',
  description:      '',
  numModules:       6,
  lessonsPerModule: 4,
  level:            'Intermedio',
  category:         'PropTech',
  type:             'public',
  audience:         'Profesionales del sector inmobiliario',
  language:         'Español',
}

export default function AIGenerator({ onNavigate }) {
  const [config, setConfig]     = useState(DEFAULT_CONFIG)
  const [structure, setStructure] = useState(null)   // generated JSON
  const [phase, setPhase]       = useState('idle')   // idle | generating-structure | generating-content | done | saving
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError]       = useState(null)
  const [saved, setSaved]       = useState(false)
  const [docFile, setDocFile]   = useState(null)     // File object
  const [docText, setDocText]   = useState('')       // extracted text
  const [docLoading, setDocLoading] = useState(false)
  const fileInputRef = useRef(null)

  const set = (key, val) => setConfig(c => ({ ...c, [key]: val }))

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDocLoading(true)
    setError(null)
    try {
      const text = await extractTextFromFile(file)
      setDocFile(file)
      setDocText(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setDocLoading(false)
      e.target.value = ''
    }
  }

  const clearDoc = () => { setDocFile(null); setDocText('') }

  const totalLessons = structure
    ? structure.modules.reduce((s, m) => s + m.lessons.length, 0)
    : 0

  // ── Step 1: generate structure ──────────────────────────────────────────────

  const handleGenStructure = async () => {
    if (!config.title.trim()) { setError('El título del curso es obligatorio.'); return }
    setError(null)
    setPhase('generating-structure')
    setStructure(null)
    setSaved(false)

    try {
      const docContext = docText
        ? `\n\nCONTENIDO DEL DOCUMENTO DE REFERENCIA (úsalo como base para los módulos y lecciones):\n${docText.slice(0, 15000)}`
        : ''

      const userPrompt = `Crea un curso sobre: "${config.title}"
Descripción/contexto: ${config.description || 'Sin descripción adicional'}
Número de módulos: ${config.numModules}
Lecciones por módulo: ${config.lessonsPerModule}
Nivel: ${config.level}
Categoría: ${config.category}
Audiencia objetivo: ${config.audience}
Idioma: ${config.language}${docContext}`

      const text = await callClaude(STRUCTURE_SYSTEM, userPrompt, 8000)

      // Parse — strip any accidental markdown backticks
      const clean = text.replace(/```json?/g, '').replace(/```/g, '').trim()
      let parsed
      try {
        parsed = JSON.parse(clean)
      } catch (parseErr) {
        // Truncated JSON: retry with a higher token budget
        const text2 = await callClaude(STRUCTURE_SYSTEM, userPrompt + '\nIMPORTANTE: El JSON debe estar completamente cerrado con todos los corchetes y llaves de cierre.', 12000)
        const clean2 = text2.replace(/```json?/g, '').replace(/```/g, '').trim()
        parsed = JSON.parse(clean2)
      }
      setStructure(parsed)
      setPhase('idle')
    } catch (e) {
      setError(`Error generando estructura: ${e.message}`)
      setPhase('idle')
    }
  }

  // ── Step 2: generate full content ───────────────────────────────────────────

  const generateContentForModule = async (moduleObj, courseTitle, level) => {
    const lessonsWithContent = []
    for (const lesson of moduleObj.lessons) {
      const userPrompt = `Curso: "${courseTitle}"
Módulo: "${moduleObj.title}"
Lección: "${lesson.title}"
Nivel: ${level}
Audiencia: ${config.audience}

Genera el HTML completo de esta lección.`
      const html = await callClaude(LESSON_SYSTEM, userPrompt, 8000)
      const clean = html.replace(/```html?/g, '').replace(/```/g, '').trim()
      lessonsWithContent.push({ ...lesson, content: clean })
    }
    return { ...moduleObj, lessons: lessonsWithContent }
  }

  const handleGenContent = async () => {
    if (!structure) return
    setError(null)
    setPhase('generating-content')

    const total = structure.modules.reduce((s, m) => s + m.lessons.length, 0)
    setProgress({ current: 0, total })

    try {
      const updatedModules = []
      let done = 0

      for (const mod of structure.modules) {
        const updatedMod = { ...mod, lessons: [] }
        for (const lesson of mod.lessons) {
          const userPrompt = `Curso: "${structure.title}"
Módulo: "${mod.title}"
Lección: "${lesson.title}"
Nivel: ${config.level}
Audiencia: ${config.audience}

Genera el HTML completo de esta lección.`
          const html = await callClaude(LESSON_SYSTEM, userPrompt, 8000)
          const clean = html.replace(/```html?/g, '').replace(/```/g, '').trim()
          updatedMod.lessons.push({ ...lesson, content: clean })
          done++
          setProgress({ current: done, total })
        }
        updatedModules.push(updatedMod)
      }

      setStructure(s => ({ ...s, modules: updatedModules }))
      setPhase('done')
    } catch (e) {
      setError(`Error generando contenido: ${e.message}`)
      setPhase('idle')
    }
  }

  // ── Regenerate single module ────────────────────────────────────────────────

  const handleRegenModule = async (modIndex) => {
    if (!structure) return
    setError(null)
    setPhase('generating-content')
    const mod = structure.modules[modIndex]
    const total = mod.lessons.length
    setProgress({ current: 0, total })

    try {
      const updated = await generateContentForModule(mod, structure.title, config.level)
      setStructure(s => ({
        ...s,
        modules: s.modules.map((m, i) => i === modIndex ? updated : m),
      }))
      setProgress(p => ({ ...p, current: total }))
      setPhase('done')
    } catch (e) {
      setError(`Error regenerando módulo: ${e.message}`)
      setPhase('idle')
    }
  }

  // ── Step 3: save to Supabase ────────────────────────────────────────────────

  const handleSave = async () => {
    if (!structure) return
    setError(null)
    setPhase('saving')

    const courseId = slugify(structure.title)
    const totalModules = structure.modules.length
    const totalLessons = structure.modules.reduce((s, m) => s + m.lessons.length, 0)

    try {
      // 1. Insert course
      const { error: cErr } = await supabase.from('courses').upsert({
        id:            courseId,
        title:         structure.title,
        subtitle:      structure.subtitle ?? '',
        description:   structure.description ?? '',
        category:      config.category,
        level:         config.level,
        duration:      `${Math.round(totalLessons * 0.2)} horas`,
        total_modules: totalModules,
        total_lessons: totalLessons,
        status:        'draft',
        type:          config.type,
        topics:        structure.topics ?? [],
        updated_at:    new Date().toISOString(),
      }, { onConflict: 'id' })
      if (cErr) throw new Error(`courses: ${cErr.message}`)

      // 2. Insert modules + lessons + quizzes
      for (let mi = 0; mi < structure.modules.length; mi++) {
        const mod = structure.modules[mi]

        const { data: modData, error: mErr } = await supabase.from('modules')
          .insert({ course_id: courseId, title: mod.title, position: mi })
          .select('id').single()
        if (mErr) throw new Error(`modules: ${mErr.message}`)

        const moduleId = modData.id

        // Lessons
        const lessonsToInsert = mod.lessons.map((l, li) => ({
          id:        `${courseId}-${mi}-${li + 1}`,
          module_id: moduleId,
          course_id: courseId,
          title:     l.title,
          duration:  l.duration ?? '10 min',
          content:   l.content ?? '',
          position:  li,
        }))
        if (lessonsToInsert.length > 0) {
          const { error: lErr } = await supabase.from('lessons').upsert(lessonsToInsert, { onConflict: 'id' })
          if (lErr) throw new Error(`lessons: ${lErr.message}`)
        }

        // Quiz questions
        if (mod.quiz?.questions?.length > 0) {
          const questionsToInsert = mod.quiz.questions.map((q, qi) => ({
            module_id:      moduleId,
            course_id:      courseId,
            question:       q.question,
            options:        q.options,
            correct_answer: q.correct_answer ?? 0,
            position:       qi,
          }))
          const { error: qErr } = await supabase.from('quiz_questions').insert(questionsToInsert)
          if (qErr) throw new Error(`quiz_questions: ${qErr.message}`)
        }
      }

      setSaved(true)
      setPhase('idle')

      // Navigate to editor after short delay
      setTimeout(() => onNavigate('course-editor', { courseId }), 1200)

    } catch (e) {
      setError(`Error guardando: ${e.message}`)
      setPhase('idle')
    }
  }

  const isGenerating = phase === 'generating-structure' || phase === 'generating-content' || phase === 'saving'
  const hasContent   = structure?.modules?.some(m => m.lessons?.some(l => l.content))

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Generador IA</h1>
        <p className="text-sm text-act-beige3">Crea un curso completo con Claude API en minutos</p>
      </div>

      {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
        <div className="mb-6 border border-amber-200 bg-amber-50 text-amber-700 px-4 py-3 text-sm" style={{ borderRadius: '2px' }}>
          Añade <code className="font-mono bg-amber-100 px-1">VITE_ANTHROPIC_API_KEY=sk-ant-...</code> en tu archivo <code className="font-mono bg-amber-100 px-1">.env</code> y reinicia el servidor.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 items-start">

        {/* ── LEFT: Config form ── */}
        <div className="space-y-5 border border-act-beige2 bg-act-white p-6" style={{ borderRadius: '2px' }}>
          <div className="flex items-center gap-3">
            <div className="h-px w-5 bg-act-burg" />
            <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Configuración del curso</span>
          </div>

          <Field label="Título del curso *">
            <input value={config.title} onChange={e => set('title', e.target.value)}
              placeholder="ej. Tokenización Inmobiliaria Avanzada"
              className={inputCls()} style={{ borderRadius: '2px' }} />
          </Field>

          <Field label="Descripción / contexto">
            <textarea value={config.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe el enfoque, los objetivos o el contexto del curso..."
              rows={3} className={inputCls() + ' resize-none'} style={{ borderRadius: '2px' }} />
          </Field>

          {/* Document upload */}
          <Field label="Documento de referencia (opcional)">
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
            {!docFile ? (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={docLoading}
                className="w-full border border-dashed border-act-beige2 bg-act-beige1/40 hover:border-act-burg hover:bg-act-beige1 transition-colors py-4 flex flex-col items-center gap-1.5 disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {docLoading ? (
                  <span className="flex items-center gap-2 text-xs text-act-beige3">
                    <span className="w-3.5 h-3.5 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
                    Extrayendo texto...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-act-beige3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-xs text-act-beige3">Adjuntar PDF o Word</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3 border border-act-beige2 bg-act-beige1/40 px-3 py-2.5" style={{ borderRadius: '2px' }}>
                <svg className="w-4 h-4 text-act-burg flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-xs text-act-black flex-1 truncate">{docFile.name}</span>
                <span className="text-[10px] text-act-beige3">{Math.round(docText.length / 1000)}k caracteres</span>
                <button type="button" onClick={clearDoc} className="text-act-beige3 hover:text-act-burg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría">
              <select value={config.category} onChange={e => set('category', e.target.value)}
                className={inputCls()} style={{ borderRadius: '2px' }}>
                {['PropTech', 'Real Estate', 'Inversión', 'Gestión', 'Finanzas', 'Legal'].map(c =>
                  <option key={c}>{c}</option>
                )}
              </select>
            </Field>
            <Field label="Nivel">
              <select value={config.level} onChange={e => set('level', e.target.value)}
                className={inputCls()} style={{ borderRadius: '2px' }}>
                {['Básico', 'Intermedio', 'Avanzado'].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo">
              <select value={config.type} onChange={e => set('type', e.target.value)}
                className={inputCls()} style={{ borderRadius: '2px' }}>
                <option value="public">Público</option>
                <option value="internal">Interno</option>
              </select>
            </Field>
            <Field label="Idioma">
              <select value={config.language} onChange={e => set('language', e.target.value)}
                className={inputCls()} style={{ borderRadius: '2px' }}>
                {['Español', 'Inglés', 'Catalán'].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Audiencia objetivo">
            <input value={config.audience} onChange={e => set('audience', e.target.value)}
              placeholder="ej. Agentes inmobiliarios con 2+ años de experiencia"
              className={inputCls()} style={{ borderRadius: '2px' }} />
          </Field>

          <Slider label="Número de módulos" value={config.numModules} min={3} max={15}
            onChange={v => set('numModules', v)} />

          <Slider label="Lecciones por módulo" value={config.lessonsPerModule} min={2} max={8}
            onChange={v => set('lessonsPerModule', v)} />

          <div className="text-xs text-act-beige3 bg-act-beige1 px-3 py-2" style={{ borderRadius: '2px' }}>
            Total estimado: {config.numModules} módulos · {config.numModules * config.lessonsPerModule} lecciones · ~{Math.round(config.numModules * config.lessonsPerModule * 0.2)} horas
          </div>

          {error && (
            <div className="text-xs text-act-burg bg-red-50 border border-red-100 px-3 py-2.5" style={{ borderRadius: '2px' }}>
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <button onClick={handleGenStructure} disabled={isGenerating || !config.title.trim()}
              className="w-full bg-act-burg text-white py-2.5 text-sm font-medium tracking-[0.06em] uppercase hover:bg-act-burg-l transition-colors disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >
              {phase === 'generating-structure' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando estructura...
                </span>
              ) : 'Generar estructura'}
            </button>

            {structure && !hasContent && (
              <button onClick={handleGenContent} disabled={isGenerating}
                className="w-full border border-act-black text-act-black py-2.5 text-sm font-medium hover:bg-act-black hover:text-white transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {phase === 'generating-content' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-act-black border-t-transparent rounded-full animate-spin" />
                    Generando contenido...
                  </span>
                ) : `Generar contenido completo (${totalLessons} lecciones)`}
              </button>
            )}

            {phase === 'generating-content' && (
              <ProgressBar current={progress.current} total={progress.total} label="Lecciones generadas" />
            )}

            {(hasContent || phase === 'done') && (
              <button onClick={handleSave} disabled={isGenerating || saved}
                className="w-full bg-emerald-600 text-white py-2.5 text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {phase === 'saving' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando en Supabase...
                  </span>
                ) : saved ? 'Guardado — redirigiendo...' : 'Guardar en Supabase'}
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div className="border border-act-beige2 bg-act-white" style={{ borderRadius: '2px' }}>
          <div className="px-5 py-4 border-b border-act-beige2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-px w-5 bg-act-burg" />
              <span className="text-xs text-act-burg tracking-[0.2em] uppercase font-medium">Vista previa</span>
            </div>
            {structure && (
              <span className="text-xs text-act-beige3">
                {structure.modules.length} módulos · {totalLessons} lecciones
              </span>
            )}
          </div>

          <div className="p-5">
            {!structure && phase !== 'generating-structure' && (
              <div className="py-12 text-center text-act-beige3">
                <svg className="w-8 h-8 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <p className="text-sm">La estructura generada aparecerá aquí</p>
              </div>
            )}

            {phase === 'generating-structure' && (
              <div className="py-12 text-center">
                <div className="w-6 h-6 border-2 border-act-burg border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-act-beige3">Claude está diseñando la estructura del curso...</p>
              </div>
            )}

            {structure && (
              <div className="space-y-3">
                {/* Course info */}
                <div className="bg-act-beige1 px-4 py-3 border border-act-beige2" style={{ borderRadius: '2px' }}>
                  <div className="font-display text-lg font-semibold text-act-black">{structure.title}</div>
                  {structure.subtitle && <div className="text-xs text-act-beige3 italic mt-0.5">{structure.subtitle}</div>}
                  {structure.description && <div className="text-xs text-act-black/60 mt-1.5 leading-relaxed">{structure.description}</div>}
                  {structure.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {structure.topics.map(t => (
                        <span key={t} className="text-[10px] bg-act-white border border-act-beige2 px-1.5 py-0.5 text-act-black/50" style={{ borderRadius: '2px' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modules */}
                {structure.modules.map((mod, mi) => {
                  const allHaveContent = mod.lessons.every(l => l.content)
                  return (
                    <div key={mi} className="border border-act-beige2" style={{ borderRadius: '2px' }}>
                      <div className="flex items-center justify-between px-4 py-2.5 bg-act-beige1 border-b border-act-beige2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-act-beige3 w-5">{mi + 1}.</span>
                          <span className="text-sm font-medium text-act-black">{mod.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {allHaveContent && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5" style={{ borderRadius: '2px' }}>HTML</span>
                          )}
                          {!isGenerating && (
                            <button onClick={() => handleRegenModule(mi)}
                              className="text-[10px] text-act-beige3 hover:text-act-burg transition-colors"
                            >Regenerar</button>
                          )}
                        </div>
                      </div>
                      <div className="px-4 py-2 space-y-1">
                        {mod.lessons.map((l, li) => (
                          <div key={li} className="flex items-center gap-2 py-1 border-b border-act-beige1 last:border-0">
                            <span className="text-[10px] text-act-beige3 w-6 flex-shrink-0">{mi + 1}.{li + 1}</span>
                            <span className="text-xs text-act-black flex-1">{l.title}</span>
                            <span className="text-[10px] text-act-beige3 flex-shrink-0">{l.duration}</span>
                            {l.content && <span className="text-[10px] text-emerald-600">✓</span>}
                          </div>
                        ))}
                        {mod.quiz?.questions?.length > 0 && (
                          <div className="text-[10px] text-act-beige3 pt-1">
                            Quiz: {mod.quiz.questions.length} pregunta{mod.quiz.questions.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
