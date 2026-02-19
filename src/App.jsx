import { useEffect, useMemo, useState } from "react";
import AdminPage from "./components/AdminPage";
import ContactSection from "./components/ContactSection";
import FeaturedMenuSection from "./components/FeaturedMenuSection";
import GallerySection from "./components/GallerySection";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import OrderSection from "./components/OrderSection";
import StorySection from "./components/StorySection";
import TestimonialsSection from "./components/TestimonialsSection";
import { createContactMessage, createOrder, fetchContent } from "./apiClient";
import { CART_STORAGE_KEY, readPersistedCart } from "./utils/cartStorage";

const emptyContact = { name: "", email: "", message: "" };
const emptyCheckout = { name: "", phone: "", pickupTime: "" };
const defaultSiteSettings = {
  brandName: "Golden Crumb Bakery",
  navMenu: "Menu",
  navOrder: "Order",
  navGallery: "Gallery",
  navStory: "Our Story",
  navContact: "Contact",
  heroEyebrow: "Fresh every morning",
  heroTitle: "Handcrafted bakes made with warmth and tradition.",
  heroSubtitle:
    "Artisan breads, elegant cakes, and small-batch pastries baked daily in the heart of your neighborhood.",
  heroPrimaryCta: "Order for Pickup",
  heroSecondaryCta: "See Full Menu",
  featuredEyebrow: "Featured Favorites",
  featuredTitle: "Signature bakes customers love most",
  orderEyebrow: "Online Ordering",
  orderTitle: "Build your bakery box",
  storyEyebrow: "Our Story",
  storyTitle: "Family recipes, modern craft, and local ingredients.",
  storyBodyOne:
    "Golden Crumb began as a tiny kitchen project and grew into a full neighborhood bakery.",
  storyBodyTwo:
    "From rustic loaves to celebration cakes, we bake with care so every bite feels comforting and memorable.",
  galleryEyebrow: "Gallery",
  galleryTitle: "Inside the bakery",
  testimonialsEyebrow: "Customer Notes",
  testimonialsTitle: "What people say about Golden Crumb",
  contactEyebrow: "Contact",
  contactTitle: "Talk to our pastry team",
  mapTitle: "Visit us this week",
  mapAddress: "214 Maple Street, Portland, OR",
  mapHours: "Mon-Sat: 7:00 AM - 7:00 PM | Sun: 8:00 AM - 4:00 PM",
  mapEmail: "hello@goldencrumb.com"
};

export default function App() {
  const isAdminPage = window.location.pathname === "/admin";

  const [cart, setCart] = useState(readPersistedCart);
  const [activeSlide, setActiveSlide] = useState(0);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const [contactState, setContactState] = useState(emptyContact);
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [checkoutState, setCheckoutState] = useState(emptyCheckout);
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [orderPayload, setOrderPayload] = useState(null);

  const catalog = useMemo(() => [...featuredItems, ...orderItems], [featuredItems, orderItems]);

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
  }, [featuredItems, orderItems, galleryImages, testimonials]);

  useEffect(() => {
    if (isAdminPage) {
      return undefined;
    }

    let ignore = false;

    async function loadContent() {
      try {
        setDataLoading(true);
        setDataError("");
        const data = await fetchContent();
        if (ignore) {
          return;
        }

        setFeaturedItems(data.featuredItems ?? []);
        setOrderItems(data.orderItems ?? []);
        setGalleryImages(data.galleryImages ?? []);
        setTestimonials(data.testimonials ?? []);
        setSiteSettings((prev) => ({ ...prev, ...(data.siteSettings ?? {}) }));
      } catch (error) {
        if (!ignore) {
          setDataError(error.message || "Failed to load data");
        }
      } finally {
        if (!ignore) {
          setDataLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      ignore = true;
    };
  }, [isAdminPage]);

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
    if (galleryImages.length === 0) {
      return;
    }
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    if (galleryImages.length === 0) {
      return;
    }
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactState((prev) => ({ ...prev, [name]: value }));
    setContactErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleContactSubmit = async (event) => {
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
    if (Object.keys(errors).length > 0) {
      setContactSubmitted(false);
      return;
    }

    try {
      await createContactMessage({
        name: contactState.name.trim(),
        email: contactState.email.trim(),
        message: contactState.message.trim()
      });
      setContactSubmitted(true);
      setContactState(emptyContact);
    } catch (error) {
      setContactErrors({ api: error.message || "Failed to submit message." });
      setContactSubmitted(false);
    }
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutState((prev) => ({ ...prev, [name]: value }));
    setCheckoutErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckoutSubmit = async (event) => {
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

    try {
      await createOrder(payload);
      setOrderPayload(payload);
      setCheckoutState(emptyCheckout);
      setCheckoutErrors({});
    } catch (error) {
      setCheckoutErrors((prev) => ({
        ...prev,
        api: error.message || "Failed to place order."
      }));
    }
  };

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView();
  };

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView();
  };

  if (isAdminPage) {
    return <AdminPage />;
  }

  if (dataLoading) {
    return <div className="site-shell status-text">Loading bakery data...</div>;
  }

  if (dataError) {
    return <div className="site-shell status-text error-text">{dataError}</div>;
  }

  return (
    <div className="site-shell">
      <Header totalItems={totalItems} text={siteSettings} />

      <main>
        <HeroSection onOrderClick={scrollToOrder} onMenuClick={scrollToMenu} text={siteSettings} />

        <FeaturedMenuSection items={featuredItems} text={siteSettings} />

        <OrderSection
          items={orderItems}
          cart={cart}
          cartRows={cartRows}
          totalItems={totalItems}
          totalPrice={totalPrice}
          checkoutState={checkoutState}
          checkoutErrors={checkoutErrors}
          orderPayload={orderPayload}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onCheckoutChange={handleCheckoutChange}
          onCheckoutSubmit={handleCheckoutSubmit}
          onClearCart={clearCart}
          text={siteSettings}
        />

        <StorySection text={siteSettings} />

        <GallerySection
          images={galleryImages}
          activeSlide={activeSlide}
          onPrev={prevSlide}
          onNext={nextSlide}
          text={siteSettings}
        />

        <TestimonialsSection items={testimonials} text={siteSettings} />

        <ContactSection
          contactState={contactState}
          contactErrors={contactErrors}
          contactSubmitted={contactSubmitted}
          onContactChange={handleContactChange}
          onContactSubmit={handleContactSubmit}
          text={siteSettings}
        />
      </main>
    </div>
  );
}
