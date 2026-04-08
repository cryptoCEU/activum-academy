/**
 * courseLoader.js
 *
 * Carga los datos de un curso desde Supabase.
 * Si Supabase falla o devuelve vacío, usa los datos
 * estáticos de courseData.js como fallback.
 *
 * Retorna un objeto con la misma forma que courseData.js:
 * {
 *   title, subtitle, duration,
 *   modules: [{ id, title, position, lessons: [...], quiz: { questions: [...] } }]
 * }
 */

import { supabase }        from '../supabase'
import { courseData }      from './courseData'       // fallback estático
import { flexLivingData }  from './flexLivingData'   // fallback estático

const STATIC_FALLBACK = {
  'tokenizacion-inmobiliaria': courseData,
  'flex-living-espana':        flexLivingData,
}

export async function loadCourse(courseId) {
  try {
    // 1. Datos del curso
    const { data: course, error: cErr } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (cErr || !course) {
      console.warn('[courseLoader] curso no encontrado en Supabase, usando fallback:', courseId)
      return STATIC_FALLBACK[courseId] ?? null
    }

    // 2. Módulos
    const { data: modules, error: mErr } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('position')

    if (mErr || !modules?.length) {
      console.warn('[courseLoader] sin módulos en Supabase, usando fallback')
      return STATIC_FALLBACK[courseId] ?? null
    }

    // 3. Lecciones y quizzes (en paralelo)
    const [lessonsRes, quizzesRes] = await Promise.all([
      supabase.from('lessons').select('*').eq('course_id', courseId).order('position'),
      supabase.from('quiz_questions').select('*').eq('course_id', courseId).order('position'),
    ])

    const lessons  = lessonsRes.data  ?? []
    const quizzes  = quizzesRes.data  ?? []

    // 4. Ensamblar en el formato que espera el LMS
    const assembled = {
      title:    course.title,
      subtitle: course.subtitle ?? '',
      duration: course.duration ?? '',
      modules:  modules.map(mod => ({
        id:       mod.position,             // el LMS usa posición numérica como id
        _uuid:    mod.id,                   // guardamos el UUID por si hace falta
        title:    mod.title,
        position: mod.position,
        lessons:  lessons
          .filter(l => l.module_id === mod.id)
          .sort((a, b) => a.position - b.position)
          .map(l => ({
            id:       l.id,
            title:    l.title,
            duration: l.duration,
            content:  l.content ?? '',
          })),
        quiz: {
          questions: quizzes
            .filter(q => q.module_id === mod.id)
            .sort((a, b) => a.position - b.position)
            .map(q => ({
              question: q.question,
              options:  q.options,
              correct:  q.correct_answer,
            })),
        },
      })),
    }

    return assembled

  } catch (err) {
    console.error('[courseLoader] error inesperado, usando fallback:', err.message)
    return STATIC_FALLBACK[courseId] ?? null
  }
}

/**
 * loadCatalog — carga el catálogo desde Supabase.
 * Fallback a catalogData.js si falla.
 */
import { catalogData } from './catalogData'

export async function loadCatalog() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, subtitle, description, category, level, duration, total_modules, total_lessons, status, type, badge, topics')
      .order('created_at')

    if (error || !data?.length) {
      console.warn('[courseLoader] catálogo vacío en Supabase, usando fallback')
      return catalogData
    }

    // Adaptar al formato que espera AcademyLanding / Dashboard
    const fromSupabase = data.map(c => ({
      id:          c.id,
      title:       c.title,
      subtitle:    c.subtitle ?? '',
      description: c.description ?? '',
      category:    c.category ?? '',
      level:       c.level ?? '',
      duration:    c.duration ?? '',
      modules:     c.total_modules,
      lessons:     c.total_lessons,
      status:      c.status,
      type:        c.type,
      badge:       c.badge ?? null,
      topics:      Array.isArray(c.topics) ? c.topics : [],
    }))

    // Fusionar con estáticos: añadir los que no estén en Supabase
    const supabaseIds = new Set(fromSupabase.map(c => c.id))
    const onlyStatic  = catalogData.filter(c => !supabaseIds.has(c.id))
    return [...fromSupabase, ...onlyStatic]
  } catch (err) {
    console.error('[courseLoader] error cargando catálogo:', err.message)
    return catalogData
  }
}
