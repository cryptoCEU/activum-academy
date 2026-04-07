export default function CourseEditor({ courseId, onNavigate }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Editor de curso</h1>
      <p className="text-sm text-act-beige3">courseId: {courseId ?? '—'} — próximo paso.</p>
    </div>
  )
}
