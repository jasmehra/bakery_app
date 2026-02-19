import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "golden-crumb-cart-v1";

const featuredItems = [
  {
    id: "croissant",
    title: "Honey Butter Croissant",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cake",
    title: "Berry Velvet Cake",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sourdough",
    title: "Sourdough Loaf",
    price: 7,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
  }
];

const orderItems = [
  {
    id: "macarons",
    title: "Rose Macaron Box",
    note: "Box of 8 assorted macarons",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cinnamon",
    title: "Cinnamon Swirl Buns",
    note: "Pack of 4 soft baked buns",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tart",
    title: "Seasonal Fruit Tart",
    note: "Serves 6, fresh berries",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "baguette",
    title: "Classic Baguette",
    note: "Slow fermented, crusty finish",
    price: 5,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80"
  }
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=1400&q=80",
    alt: "Fresh croissants on a tray"
  },
  {
    src: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1400&q=80",
    alt: "Bakery storefront with pastry display"
  },
  {
    src: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1400&q=80",
    alt: "Decorated cakes arranged for pickup"
  }
];

const testimonials = [
  {
    name: "Maya R.",
    text: "The best almond croissant I have ever had. Flaky, buttery, and perfect with coffee."
  },
  {
    name: "Kevin T.",
    text: "We ordered a birthday cake and it looked beautiful and tasted even better."
  },
  {
    name: "Jules P.",
    text: "Their fresh sourdough has become a weekend tradition in our home."
  }
];

const emptyContact = { name: "", email: "", message: "" };
const emptyCheckout = { name: "", phone: "", pickupTime: "" };

function readPersistedCart() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [cart, setCart] = useState(readPersistedCart);
  const [activeSlide, setActiveSlide] = useState(0);

  const [contactState, setContactState] = useState(emptyContact);
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [checkoutState, setCheckoutState] = useState(emptyCheckout);
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [orderPayload, setOrderPayload] = useState(null);

  const catalog = [...featuredItems, ...orderItems];

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const nextValue = Math.max((prev[id] ?? 0) - 1, 0);
      const next = { ...prev };
      if (nextValue === 0) {
        delete next[id];
      } else {
        next[id] = nextValue;
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    setOrderPayload(null);
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartRows = Object.entries(cart)
    .map(([id, qty]) => {
      const item = catalog.find((entry) => entry.id === id);
      return item ? { ...item, qty, lineTotal: item.price * qty } : null;
    })
    .filter(Boolean);

  const totalPrice = cartRows.reduce((sum, item) => sum + item.lineTotal, 0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactState((prev) => ({ ...prev, [name]: value }));
    setContactErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    if (!contactState.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!/\S+@\S+\.\S+/.test(contactState.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (contactState.message.trim().length < 12) {
      errors.message = "Message should be at least 12 characters.";
    }

    setContactErrors(errors);
    if (Object.keys(errors).length === 0) {
      setContactSubmitted(true);
      setContactState(emptyContact);
    } else {
      setContactSubmitted(false);
    }
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutState((prev) => ({ ...prev, [name]: value }));
    setCheckoutErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    if (totalItems === 0) {
      errors.cart = "Add at least one item to checkout.";
    }
    if (!checkoutState.name.trim()) {
      errors.name = "Pickup name is required.";
    }
    if (!/^\+?[0-9()\-\s]{8,}$/.test(checkoutState.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (!checkoutState.pickupTime) {
      errors.pickupTime = "Pick a pickup time.";
    }

    setCheckoutErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      orderId: `GC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: checkoutState.name.trim(),
        phone: checkoutState.phone.trim()
      },
      pickupTime: checkoutState.pickupTime,
      items: cartRows.map((row) => ({
        id: row.id,
        title: row.title,
        qty: row.qty,
        unitPrice: row.price,
        lineTotal: Number(row.lineTotal.toFixed(2))
      })),
      totals: {
        itemCount: totalItems,
        subtotal: Number(totalPrice.toFixed(2))
      }
    };

    setOrderPayload(payload);
    setCheckoutState(emptyCheckout);
  };

  return (
    <div className="site-shell">
      <header className="topbar" data-reveal>
        <p className="brand">Golden Crumb Bakery</p>
        <nav>
          <a href="#menu">Menu</a>
          <a href="#order">Order</a>
          <a href="#gallery">Gallery</a>
          <a href="#story">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="cart-pill">Cart: {totalItems}</p>
      </header>

      <main>
        <section className="hero" data-reveal>
          <div className="hero-content" style={{ "--delay": "0.08s" }} data-reveal>
            <p className="eyebrow">Fresh every morning</p>
            <h1>Handcrafted bakes made with warmth and tradition.</h1>
            <p>
              Artisan breads, elegant cakes, and small-batch pastries baked daily in
              the heart of your neighborhood.
            </p>
            <div className="hero-cta">
              <button onClick={() => document.getElementById("order")?.scrollIntoView()}>
                Order for Pickup
              </button>
              <button
                className="ghost"
                onClick={() => document.getElementById("menu")?.scrollIntoView()}
              >
                See Full Menu
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

        <section className="section" id="menu" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Featured Favorites</p>
            <h2>Signature bakes customers love most</h2>
          </div>
          <div className="item-grid">
            {featuredItems.map((item, index) => (
              <article
                className="item-card"
                key={item.id}
                data-reveal
                style={{ "--delay": `${0.06 * (index + 1)}s` }}
              >
                <img src={item.image} alt={item.title} />
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section order-section" id="order" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Online Ordering</p>
            <h2>Build your bakery box</h2>
          </div>
          <div className="order-layout">
            <div className="order-grid">
              {orderItems.map((item, index) => (
                <article
                  className="order-card"
                  key={item.id}
                  data-reveal
                  style={{ "--delay": `${0.07 * (index + 1)}s` }}
                >
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                  <div className="order-row">
                    <strong>${item.price.toFixed(2)}</strong>
                    <div className="order-actions">
                      <button className="ghost small" onClick={() => removeFromCart(item.id)}>
                        -
                      </button>
                      <span>{cart[item.id] ?? 0}</span>
                      <button className="small" onClick={() => addToCart(item.id)}>
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-panel" data-reveal style={{ "--delay": "0.12s" }}>
              <h3>Pickup Summary</h3>
              <p>{totalItems} item(s) selected</p>
              <div className="cart-list">
                {cartRows.length === 0 ? (
                  <p className="muted">Your cart is empty.</p>
                ) : (
                  cartRows.map((row) => (
                    <p key={row.id}>
                      {row.title} x {row.qty}
                    </p>
                  ))
                )}
              </div>
              <p className="cart-total">${totalPrice.toFixed(2)}</p>

              <form className="checkout-form" onSubmit={handleCheckoutSubmit} noValidate>
                <label htmlFor="pickupName">Pickup name</label>
                <input
                  id="pickupName"
                  name="name"
                  value={checkoutState.name}
                  onChange={handleCheckoutChange}
                />
                {checkoutErrors.name && <small className="error-text">{checkoutErrors.name}</small>}

                <label htmlFor="pickupPhone">Phone</label>
                <input
                  id="pickupPhone"
                  name="phone"
                  value={checkoutState.phone}
                  onChange={handleCheckoutChange}
                />
                {checkoutErrors.phone && <small className="error-text">{checkoutErrors.phone}</small>}

                <label htmlFor="pickupTime">Pickup time</label>
                <input
                  id="pickupTime"
                  name="pickupTime"
                  type="datetime-local"
                  value={checkoutState.pickupTime}
                  onChange={handleCheckoutChange}
                />
                {checkoutErrors.pickupTime && (
                  <small className="error-text">{checkoutErrors.pickupTime}</small>
                )}
                {checkoutErrors.cart && <small className="error-text">{checkoutErrors.cart}</small>}

                <div className="checkout-actions">
                  <button type="submit" disabled={totalItems === 0}>
                    Place Order
                  </button>
                  <button type="button" className="ghost" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </form>

              {orderPayload && (
                <div className="payload-wrap">
                  <p className="success-text">Order payload ready</p>
                  <pre>{JSON.stringify(orderPayload, null, 2)}</pre>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="section split" id="story" data-reveal>
          <img
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80"
            alt="Baker kneading dough"
            data-reveal
            style={{ "--delay": "0.08s" }}
          />
          <div data-reveal style={{ "--delay": "0.12s" }}>
            <p className="eyebrow">Our Story</p>
            <h2>Family recipes, modern craft, and local ingredients.</h2>
            <p>
              Golden Crumb began as a tiny kitchen project and grew into a full
              neighborhood bakery. Every recipe is made in-house using seasonal produce,
              cultured butter, and stone-milled flour.
            </p>
            <p>
              From rustic loaves to celebration cakes, we bake with care so every bite
              feels comforting and memorable.
            </p>
          </div>
        </section>

        <section className="section gallery-section" id="gallery" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Gallery</p>
            <h2>Inside the bakery</h2>
          </div>
          <div className="gallery-frame" data-reveal style={{ "--delay": "0.08s" }}>
            <img
              src={galleryImages[activeSlide].src}
              alt={galleryImages[activeSlide].alt}
              className="gallery-image"
            />
            <div className="gallery-controls">
              <button className="ghost small" onClick={prevSlide}>
                Prev
              </button>
              <p>
                {activeSlide + 1} / {galleryImages.length}
              </p>
              <button className="ghost small" onClick={nextSlide}>
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Customer Notes</p>
            <h2>What people say about Golden Crumb</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((quote, index) => (
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

        <section className="section contact-section" id="contact" data-reveal>
          <div className="contact-grid">
            <div data-reveal style={{ "--delay": "0.08s" }}>
              <p className="eyebrow">Contact</p>
              <h2>Talk to our pastry team</h2>
              <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={contactState.name}
                  onChange={handleContactChange}
                />
                {contactErrors.name && <small className="error-text">{contactErrors.name}</small>}

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={contactState.email}
                  onChange={handleContactChange}
                />
                {contactErrors.email && (
                  <small className="error-text">{contactErrors.email}</small>
                )}

                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={contactState.message}
                  onChange={handleContactChange}
                />
                {contactErrors.message && (
                  <small className="error-text">{contactErrors.message}</small>
                )}

                <button type="submit">Send Message</button>
                {contactSubmitted && (
                  <p className="success-text">Thanks. We will reply within one business day.</p>
                )}
              </form>
            </div>
            <div className="map-card" data-reveal style={{ "--delay": "0.12s" }}>
              <h3>Visit us this week</h3>
              <p>214 Maple Street, Portland, OR</p>
              <p>Mon-Sat: 7:00 AM - 7:00 PM | Sun: 8:00 AM - 4:00 PM</p>
              <a href="mailto:hello@goldencrumb.com">hello@goldencrumb.com</a>
              <iframe
                title="Golden Crumb Bakery Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-122.684%2C45.518%2C-122.666%2C45.528&layer=mapnik&marker=45.523%2C-122.675"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
