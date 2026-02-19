export default function ContactSection({
  contactState,
  contactErrors,
  contactSubmitted,
  onContactChange,
  onContactSubmit,
  text
}) {
  return (
    <section className="section contact-section" id="contact" data-reveal>
      <div className="contact-grid">
        <div data-reveal style={{ "--delay": "0.08s" }}>
          <p className="eyebrow">{text.contactEyebrow}</p>
          <h2>{text.contactTitle}</h2>
          <form className="contact-form" onSubmit={onContactSubmit} noValidate>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={contactState.name} onChange={onContactChange} />
            {contactErrors.name && <small className="error-text">{contactErrors.name}</small>}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={contactState.email}
              onChange={onContactChange}
            />
            {contactErrors.email && <small className="error-text">{contactErrors.email}</small>}

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={contactState.message}
              onChange={onContactChange}
            />
            {contactErrors.message && <small className="error-text">{contactErrors.message}</small>}
            {contactErrors.api && <small className="error-text">{contactErrors.api}</small>}

            <button type="submit">Send Message</button>
            {contactSubmitted && (
              <p className="success-text">Thanks. We will reply within one business day.</p>
            )}
          </form>
        </div>

        <div className="map-card" data-reveal style={{ "--delay": "0.12s" }}>
          <h3>{text.mapTitle}</h3>
          <p>{text.mapAddress}</p>
          <p>{text.mapHours}</p>
          <a href={`mailto:${text.mapEmail}`}>{text.mapEmail}</a>
          <iframe
            title="Golden Crumb Bakery Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-122.684%2C45.518%2C-122.666%2C45.528&layer=mapnik&marker=45.523%2C-122.675"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
