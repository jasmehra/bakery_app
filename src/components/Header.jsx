export default function Header({ totalItems, text }) {
  return (
    <header className="topbar" data-reveal>
      <p className="brand">{text.brandName}</p>
      <nav>
        <a href="#menu">{text.navMenu}</a>
        <a href="#order">{text.navOrder}</a>
        <a href="#gallery">{text.navGallery}</a>
        <a href="#story">{text.navStory}</a>
        <a href="#contact">{text.navContact}</a>
      </nav>
      <p className="cart-pill">Cart: {totalItems}</p>
    </header>
  );
}
