// Simple auth system using localStorage
// In production this would connect to a real backend/Supabase

const USERS_KEY = 'activum_users'
const SESSION_KEY = 'activum_session'
const PROGRESS_KEY = 'activum_progress'

// ---- User helpers ----
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// ---- Progress helpers ----
function getProgressKey(userId, courseId) {
  return `${PROGRESS_KEY}_${userId}_${courseId}`
}
export function loadProgress(userId, courseId) {
  try {
    const raw = localStorage.getItem(getProgressKey(userId, courseId))
    return raw ? JSON.parse(raw) : { completedLessons: [], completedQuizzes: {}, quizScores: {} }
  } catch { return { completedLessons: [], completedQuizzes: {}, quizScores: {} } }
}
export function saveProgress(userId, courseId, progress) {
  localStorage.setItem(getProgressKey(userId, courseId), JSON.stringify(progress))
}

// ---- Auth actions ----
export function register({ name, email, password }) {
  const users = getUsers()
  const id = email.toLowerCase().trim()
  if (users[id]) return { error: 'Ya existe una cuenta con ese email.' }
  if (!name.trim()) return { error: 'El nombre es obligatorio.' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  const user = { id, name: name.trim(), email: id, createdAt: new Date().toISOString() }
  users[id] = { ...user, password } // NOTE: plain text — for demo only
  saveUsers(users)
  const session = { userId: id, name: user.name, email: id }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: session }
}

export function login({ email, password }) {
  const users = getUsers()
  const id = email.toLowerCase().trim()
  const user = users[id]
  if (!user) return { error: 'No encontramos una cuenta con ese email.' }
  if (user.password !== password) return { error: 'Contraseña incorrecta.' }
  const session = { userId: id, name: user.name, email: id }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: session }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}
