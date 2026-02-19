export default function GallerySection({ images, activeSlide, onPrev, onNext, text }) {
  if (!images.length) {
    return null;
  }

  return (
    <section className="section gallery-section" id="gallery" data-reveal>
      <div className="section-head">
        <p className="eyebrow">{text.galleryEyebrow}</p>
        <h2>{text.galleryTitle}</h2>
      </div>
      <div className="gallery-frame" data-reveal style={{ "--delay": "0.08s" }}>
        <img src={images[activeSlide].src} alt={images[activeSlide].alt} className="gallery-image" />
        <div className="gallery-controls">
          <button className="ghost small" onClick={onPrev}>
            Prev
          </button>
          <p>
            {activeSlide + 1} / {images.length}
          </p>
          <button className="ghost small" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
