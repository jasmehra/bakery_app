export default function StorySection({ text }) {
  return (
    <section className="section split" id="story" data-reveal>
      <img
        src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80"
        alt="Baker kneading dough"
        data-reveal
        style={{ "--delay": "0.08s" }}
      />
      <div data-reveal style={{ "--delay": "0.12s" }}>
        <p className="eyebrow">{text.storyEyebrow}</p>
        <h2>{text.storyTitle}</h2>
        <p>{text.storyBodyOne}</p>
        <p>{text.storyBodyTwo}</p>
      </div>
    </section>
  );
}
