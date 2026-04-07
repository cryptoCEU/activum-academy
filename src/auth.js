import { supabase } from './supabase'

// ---- Auth actions ----

export async function register({ name, email, password }) {
  if (!name.trim()) return { error: 'El nombre es obligatorio.' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: { data: { name: name.trim() } },
  })

  if (error) return { error: error.message }

  const u = data.user
  return {
    user: {
      userId: u.id,
      name: u.user_metadata?.name ?? name.trim(),
      email: u.email,
    },
  }
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email o contraseña incorrectos.' }
    }
    return { error: error.message }
  }

  const u = data.user
  return {
    user: {
      userId: u.id,
      name: u.user_metadata?.name ?? u.email,
      email: u.email,
    },
  }
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  const u = data?.session?.user
  if (!u) return null
  return {
    userId: u.id,
    name: u.user_metadata?.name ?? u.email,
    email: u.email,
  }
}

// ---- Progress ----

export async function loadProgress(userId, courseId) {
  const empty = { completedLessons: [], completedQuizzes: {}, quizScores: {} }

  const { data, error } = await supabase
    .from('progress')
    .select('progress')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (error) {
    console.error('[loadProgress] error:', error.message)
    return empty
  }
  console.log('[loadProgress]', data ? 'found' : 'empty', data)
  return data?.progress ?? empty
}

export async function saveProgress(userId, courseId, progress) {
  console.log('[saveProgress] saving →', { userId, courseId, progress })

  const { data, error } = await supabase
    .from('progress')
    .upsert(
      { user_id: userId, course_id: courseId, progress, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,course_id' }
    )
    .select()

  if (error) {
    console.error('[saveProgress] error:', error.message, error.details, error.hint)
  } else {
    console.log('[saveProgress] ok →', data)
  }
}
