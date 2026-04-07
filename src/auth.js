import { supabase } from './supabase'

// ── Helpers ───────────────────────────────────────────────────────────────────

function userFromSupabase(u) {
  return {
    userId:    u.id,
    name:      u.user_metadata?.name      ?? u.email,
    email:     u.email,
    empresa:   u.user_metadata?.empresa   ?? '',
    avatar_url: u.user_metadata?.avatar_url ?? null,
  }
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function register({ name, email, password }) {
  if (!name.trim()) return { error: 'El nombre es obligatorio.' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: { data: { name: name.trim() } },
  })

  if (error) return { error: error.message }
  return { user: userFromSupabase(data.user) }
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

  return { user: userFromSupabase(data.user) }
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  const u = data?.session?.user
  if (!u) return null
  return userFromSupabase(u)
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function updateProfile({ name, empresa }) {
  const { data, error } = await supabase.auth.updateUser({
    data: { name: name.trim(), empresa: empresa.trim() },
  })
  if (error) return { error: error.message }
  return { user: userFromSupabase(data.user) }
}

export async function updatePassword({ currentPassword, newPassword }) {
  const { data: sessionData } = await supabase.auth.getSession()
  const email = sessionData?.session?.user?.email
  if (!email) return { error: 'No hay sesión activa.' }

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
  if (signInError) return { error: 'La contraseña actual es incorrecta.' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return { success: true }
}

export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_user')
  if (error) return { error: error.message }
  await supabase.auth.signOut()
  return { success: true }
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export async function uploadAvatar(userId, file) {
  const path = `${userId}/avatar`
  console.log('[avatar] subiendo archivo...', { path, type: file.type, size: file.size })

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    console.error('[avatar] error subiendo a Storage:', uploadError.message)
    return { error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Cache-buster so the browser fetches the new image after an update
  const avatar_url = `${publicUrl}?t=${Date.now()}`
  console.log('[avatar] archivo subido, url:', avatar_url)

  console.log('[avatar] guardando en user_metadata...')
  const { data, error } = await supabase.auth.updateUser({ data: { avatar_url } })
  if (error) {
    console.error('[avatar] error guardando en user_metadata:', error.message)
    return { error: error.message }
  }
  console.log('[avatar] guardado correctamente, user_metadata:', data.user.user_metadata)

  // Re-fetch from server to guarantee fresh metadata in the returned user
  const { data: fresh } = await supabase.auth.getUser()
  return { user: userFromSupabase(fresh?.user ?? data.user) }
}

export async function deleteAvatar(userId) {
  await supabase.storage.from('avatars').remove([`${userId}/avatar`])

  const { data, error } = await supabase.auth.updateUser({ data: { avatar_url: null } })
  if (error) return { error: error.message }
  return { user: userFromSupabase(data.user) }
}

// ── Role ──────────────────────────────────────────────────────────────────────

export async function loadUserRole(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[role] error cargando perfil:', error.message)
    return 'user'
  }

  console.log('[role] rol cargado:', profile.role)
  return profile.role ?? 'user'
}

// ── Progress ──────────────────────────────────────────────────────────────────

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
  return data?.progress ?? empty
}

export async function saveProgress(userId, courseId, progress) {
  const { error } = await supabase
    .from('progress')
    .upsert(
      { user_id: userId, course_id: courseId, progress, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,course_id' }
    )
    .select()

  if (error) console.error('[saveProgress] error:', error.message)
}
