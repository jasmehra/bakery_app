export default function HeroSection({ onOrderClick, onMenuClick, text }) {
  return (
    <section className="hero" data-reveal>
      <div className="hero-content" style={{ "--delay": "0.08s" }} data-reveal>
        <p className="eyebrow">{text.heroEyebrow}</p>
        <h1>{text.heroTitle}</h1>
        <p>{text.heroSubtitle}</p>
        <div className="hero-cta">
          <button onClick={onOrderClick}>{text.heroPrimaryCta}</button>
          <button className="ghost" onClick={onMenuClick}>
            {text.heroSecondaryCta}
          </button>
        </div>
      </div>
      <div className="hero-image-wrap" style={{ "--delay": "0.16s" }} data-reveal>
        <img
          src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1200&q=80"
          alt="Fresh pastries on a bakery counter"
          className="hero-image"
        />
      </div>
    </section>
  );
}
