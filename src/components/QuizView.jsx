import { useState } from 'react'

export default function QuizView({ module: mod, quizScore, onComplete, onNext }) {
  const [answers, setAnswers]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore]         = useState(null)
  const [retrying, setRetrying]   = useState(false)
  const quiz = mod.quiz
  const alreadyDone = quizScore !== undefined && !retrying

  const handleSelect = (qi, oi) => { if (!submitted) setAnswers(p => ({ ...p, [qi]: oi })) }
  const correctAnswer = (q) => q.correct_answer ?? q.answer

  const handleSubmit = () => {
    let correct = 0
    quiz.questions.forEach((q, i) => { if (answers[i] === correctAnswer(q)) correct++ })
    const pct = Math.round((correct / quiz.questions.length) * 100)
    setScore(pct); setSubmitted(true); onComplete(mod.id, pct)
  }
  const allAnswered = Object.keys(answers).length === quiz.questions.length

  if (alreadyDone && !submitted) {
    return (
      <div className="flex flex-col h-full bg-act-white">
        <div className="flex-shrink-0 border-b border-act-beige1 px-8 py-5">
          <div className="text-[10px] font-semibold text-act-burg tracking-[0.15em] uppercase mb-2">{mod.title}</div>
          <h1 className="font-display text-2xl font-semibold text-act-black">Quiz del Modulo</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm animate-fade-in">
            <div className="font-display text-6xl font-light text-act-black mb-2">{quizScore}%</div>
            <div className="text-act-beige3 text-sm mb-1">Puntuacion obtenida</div>
            <div className={`text-sm font-medium mb-8 ${quizScore >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
              {quizScore >= 70 ? 'Quiz superado' : 'No has llegado al minimo del 70%'}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(null); setRetrying(true) }}
                className="text-xs border border-act-beige2 text-act-black/60 px-5 py-2.5 hover:border-act-black/30 hover:text-act-black transition-colors"
                style={{ borderRadius: '2px' }}>Repetir</button>
              <button onClick={onNext}
                className="text-xs bg-act-burg text-white px-5 py-2.5 hover:bg-act-burg-l transition-colors font-medium"
                style={{ borderRadius: '2px' }}>Continuar &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-act-white">
        <div className="flex-shrink-0 border-b border-act-beige1 px-8 py-5">
          <div className="text-[10px] font-semibold text-act-burg tracking-[0.15em] uppercase mb-2">{mod.title}</div>
          <h1 className="font-display text-2xl font-semibold text-act-black">Resultado del Quiz</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-center gap-8 mb-10 p-6 bg-act-beige1 border border-act-beige2" style={{ borderRadius: '2px' }}>
              <div>
                <div className="font-display text-5xl font-light text-act-black">{score}%</div>
                <div className="text-act-beige3 text-xs mt-1">{quiz.questions.filter((q,i) => answers[i] === correctAnswer(q)).length} / {quiz.questions.length} correctas</div>
              </div>
              <div className="border-l border-act-beige2 pl-8">
                <div className={`text-base font-semibold mb-1 ${score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {score >= 70 ? 'Quiz superado' : 'No superado'}
                </div>
                <div className="text-act-beige3 text-sm">
                  {score >= 70 ? 'Puedes continuar con el siguiente modulo.' : 'Necesitas 70% minimo. Repasa y vuelve a intentarlo.'}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {quiz.questions.map((q, qi) => {
                const correct = answers[qi] === correctAnswer(q)
                return (
                  <div key={qi} className={`border p-5 ${correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`} style={{ borderRadius: '2px' }}>
                    <div className="flex gap-3 mb-3">
                      <span className={`text-sm font-bold mt-0.5 flex-shrink-0 ${correct ? 'text-emerald-600' : 'text-red-500'}`}>{correct ? '+' : '-'}</span>
                      <p className="text-sm text-act-black font-medium leading-snug">{q.question || q.q}</p>
                    </div>
                    <div className="space-y-1.5 ml-5">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-xs py-1.5 px-3 ${
                          oi === correctAnswer(q) ? 'bg-emerald-100 text-emerald-700 font-medium' :
                          oi === answers[qi] && !correct ? 'bg-red-100 text-red-600' :
                          'text-act-black/40'}`} style={{ borderRadius: '2px' }}>
                          {oi === correctAnswer(q) && <span className="mr-1.5 font-bold">+</span>}
                          {oi === answers[qi] && !correct && <span className="mr-1.5">-</span>}
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 border-t border-act-beige1 px-8 py-4 bg-act-white flex justify-end gap-3">
          <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(null); setRetrying(true) }}
            className="text-xs border border-act-beige2 text-act-black/60 px-5 py-2.5 hover:border-act-black/30 hover:text-act-black transition-colors"
            style={{ borderRadius: '2px' }}>Repetir</button>
          <button onClick={onNext}
            className="text-xs bg-act-burg text-white px-6 py-2.5 hover:bg-act-burg-l transition-colors font-medium"
            style={{ borderRadius: '2px' }}>Continuar &rarr;</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-act-white">
      <div className="flex-shrink-0 border-b border-act-beige1 px-8 py-5">
        <div className="text-[10px] font-semibold text-act-burg tracking-[0.15em] uppercase mb-2">{mod.title}</div>
        <h1 className="font-display text-2xl font-semibold text-act-black">Quiz del Modulo</h1>
        <p className="text-act-beige3 text-xs mt-1">{quiz.questions.length} preguntas &middot; Minimo 70% para superar &middot; Sin limite de tiempo</p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl space-y-8 animate-fade-in">
          {quiz.questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-act-black text-sm font-medium leading-snug mb-3">
                <span className="text-act-burg mr-2 font-mono font-bold">{qi + 1}.</span>
                {q.question || q.q}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => handleSelect(qi, oi)}
                    className={`w-full text-left px-4 py-3 text-sm border transition-all ${
                      answers[qi] === oi
                        ? 'border-act-burg bg-act-burg/5 text-act-black font-medium'
                        : 'border-act-beige2 text-act-black/55 hover:border-act-beige3 hover:text-act-black'}`}
                    style={{ borderRadius: '2px' }}>
                    <span className="text-act-beige3 mr-3 font-mono text-xs">{String.fromCharCode(65+oi)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-act-beige1 px-8 py-4 bg-act-white flex items-center justify-between">
        <span className="text-xs text-act-beige3">{Object.keys(answers).length} / {quiz.questions.length} respondidas</span>
        <button onClick={handleSubmit} disabled={!allAnswered}
          className={`text-xs px-6 py-2.5 font-medium tracking-wide transition-all ${
            allAnswered ? 'bg-act-burg text-white hover:bg-act-burg-l' : 'bg-act-beige1 text-act-beige3 cursor-not-allowed'}`}
          style={{ borderRadius: '2px' }}>
          Enviar respuestas
        </button>
      </div>
    </div>
  )
}
