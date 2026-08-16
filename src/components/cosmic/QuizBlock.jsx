export function QuizBlock({ question, index, value, onChange }) {
  return (
    <section className="cc-question">
      <div className="cc-q-head">
        <small>Question {index + 1} · {question.hint}</small>
        <b>{question.title}</b>
      </div>
      <div className="cc-options">
        {question.options.map((o, i) => (
          <button
            type="button"
            key={o.label}
            className={`day-chip ${value === i ? 'active' : ''}`}
            onClick={() => onChange(i)}
          >
            <b>{o.label}</b>
            <span>{o.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
