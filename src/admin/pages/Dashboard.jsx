export default function Dashboard({ onNavigate }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-act-black mb-1">Panel</h1>
      <p className="text-sm text-act-beige3 mb-8">Resumen general de la plataforma</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['Total usuarios', 'Equipo Activum', 'Cursos publicados', 'Progreso medio'].map(l => (
          <div key={l} className="border border-act-beige2 bg-act-white p-5" style={{ borderRadius: '2px' }}>
            <div className="font-display text-3xl font-light text-act-black mb-1">—</div>
            <div className="text-xs text-act-beige3">{l}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-act-beige3 mt-8">Contenido completo en el siguiente paso.</p>
    </div>
  )
}
