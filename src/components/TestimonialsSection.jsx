export default function TestimonialsSection({ items, text }) {
  return (
    <section className="section" data-reveal>
      <div className="section-head">
        <p className="eyebrow">{text.testimonialsEyebrow}</p>
        <h2>{text.testimonialsTitle}</h2>
      </div>
      <div className="testimonial-grid">
        {items.map((quote, index) => (
          <article
            className="quote-card"
            key={quote.name}
            data-reveal
            style={{ "--delay": `${0.07 * (index + 1)}s` }}
          >
            <p>"{quote.text}"</p>
            <span>{quote.name}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
