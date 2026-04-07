export default function LessonEditor({ lessonId, onNavigate }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Editor de lección</h1>
      <p className="text-sm text-act-beige3">lessonId: {lessonId ?? '—'} — próximo paso.</p>
    </div>
  )
}
