export default function FeaturedMenuSection({ items, text }) {
  return (
    <section className="section" id="menu" data-reveal>
      <div className="section-head">
        <p className="eyebrow">{text.featuredEyebrow}</p>
        <h2>{text.featuredTitle}</h2>
      </div>
      <div className="item-grid">
        {items.map((item, index) => (
          <article
            className="item-card"
            key={item.id}
            data-reveal
            style={{ "--delay": `${0.06 * (index + 1)}s` }}
          >
            <img src={item.image} alt={item.title} />
            <div className="item-info">
              <h3>{item.title}</h3>
              <p>${Number(item.price ?? 0).toFixed(2)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
