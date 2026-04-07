/**
 * Script de migración: courseData.js + catalogData.js → Supabase SQL
 *
 * Uso:
 *   node src/admin/migrate.js > migration.sql
 *
 * Luego ejecuta migration.sql en Supabase SQL Editor.
 */

import { courseData }  from '../data/courseData.js'
import { catalogData } from '../data/catalogData.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function sql(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number')  return String(v)
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  if (Array.isArray(v) || typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
  return `'${String(v).replace(/'/g, "''")}'`
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// ── Build SQL ─────────────────────────────────────────────────────────────────

const lines = []
const p = (...args) => lines.push(args.join(' '))

p('-- ════════════════════════════════════════════════════════')
p('-- Activum Academy — Migración de courseData.js a Supabase')
p(`-- Generado: ${new Date().toISOString()}`)
p('-- ════════════════════════════════════════════════════════')
p('')
p('BEGIN;')
p('')

// ── 1. courses ────────────────────────────────────────────────────────────────

p('-- ── Cursos (desde catalogData.js) ──────────────────────')
for (const c of catalogData) {
  const totalModules = c.id === 'tokenizacion-inmobiliaria' ? courseData.modules.length : c.modules
  const totalLessons = c.id === 'tokenizacion-inmobiliaria' ? courseData.modules.reduce((s, m) => s + m.lessons.length, 0) : c.lessons
  p(`INSERT INTO courses (id, title, subtitle, description, category, level, duration, total_modules, total_lessons, status, type, badge, topics)`)
  p(`VALUES (`)
  p(`  ${sql(c.id)},`)
  p(`  ${sql(c.title)},`)
  p(`  ${sql(c.subtitle ?? '')},`)
  p(`  ${sql(c.description ?? '')},`)
  p(`  ${sql(c.category)},`)
  p(`  ${sql(c.level)},`)
  p(`  ${sql(c.duration)},`)
  p(`  ${totalModules},`)
  p(`  ${totalLessons},`)
  p(`  ${sql(c.status === 'published' ? 'published' : 'coming_soon')},`)
  p(`  ${sql(c.type ?? 'public')},`)
  p(`  ${sql(c.badge ?? null)},`)
  p(`  ${sql(c.topics ?? [])}`)
  p(`) ON CONFLICT (id) DO UPDATE SET`)
  p(`  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle,`)
  p(`  description = EXCLUDED.description, category = EXCLUDED.category,`)
  p(`  level = EXCLUDED.level, duration = EXCLUDED.duration,`)
  p(`  total_modules = EXCLUDED.total_modules, total_lessons = EXCLUDED.total_lessons,`)
  p(`  status = EXCLUDED.status, type = EXCLUDED.type,`)
  p(`  badge = EXCLUDED.badge, topics = EXCLUDED.topics,`)
  p(`  updated_at = now();`)
  p('')
}

// ── 2. modules + lessons + quiz_questions (tokenizacion only) ────────────────

p('-- ── Módulos, lecciones y quizzes (tokenizacion-inmobiliaria) ──')
p('')

for (let mi = 0; mi < courseData.modules.length; mi++) {
  const mod = courseData.modules[mi]
  const modId = uuidv4()

  p(`-- Módulo ${mi + 1}: ${mod.title}`)
  p(`INSERT INTO modules (id, course_id, title, position)`)
  p(`VALUES (${sql(modId)}, 'tokenizacion-inmobiliaria', ${sql(mod.title)}, ${mi})`)
  p(`ON CONFLICT DO NOTHING;`)
  p('')

  // Lessons
  for (let li = 0; li < mod.lessons.length; li++) {
    const lesson = mod.lessons[li]
    const lessonId = lesson.id ?? `${mi}-${li + 1}`

    p(`INSERT INTO lessons (id, module_id, course_id, title, duration, content, position)`)
    p(`VALUES (`)
    p(`  ${sql(lessonId)},`)
    p(`  ${sql(modId)},`)
    p(`  'tokenizacion-inmobiliaria',`)
    p(`  ${sql(lesson.title)},`)
    p(`  ${sql(lesson.duration ?? '10 min')},`)
    p(`  ${sql(lesson.content ?? '')},`)
    p(`  ${li}`)
    p(`) ON CONFLICT (id) DO UPDATE SET`)
    p(`  title = EXCLUDED.title, duration = EXCLUDED.duration,`)
    p(`  content = EXCLUDED.content, position = EXCLUDED.position;`)
    p('')
  }

  // Quiz questions
  if (mod.quiz?.questions?.length > 0) {
    for (let qi = 0; qi < mod.quiz.questions.length; qi++) {
      const q = mod.quiz.questions[qi]
      p(`INSERT INTO quiz_questions (module_id, course_id, question, options, correct_answer, position)`)
      p(`VALUES (`)
      p(`  ${sql(modId)},`)
      p(`  'tokenizacion-inmobiliaria',`)
      p(`  ${sql(q.question)},`)
      p(`  ${sql(q.options)},`)
      p(`  ${q.correct ?? q.correct_answer ?? 0},`)
      p(`  ${qi}`)
      p(`);`)
      p('')
    }
  }
}

p('COMMIT;')
p('')
p('-- Migración completada.')

console.log(lines.join('\n'))
