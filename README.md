# Golden Crumb Bakery App

A React + Vite bakery website template with responsive UI, online ordering interactions, gallery, and contact flow.

## Working Features

- Responsive bakery landing page with custom styling
- Sticky navigation bar with section links
- Hero section with CTA buttons and CDN-hosted images
- Featured menu section with product cards
- Online ordering section:
  - Add/remove item quantity
  - Live cart count in navbar
  - Cart summary with line items and total
  - Cart persistence via `localStorage`
- Checkout form:
  - Validation for pickup name, phone, pickup time, and cart presence
  - Generates an order payload JSON on successful submission
  - Clear cart button
- Gallery section:
  - Image carousel with Prev/Next controls
- Story section and testimonial section
- Contact form:
  - Validation for name, email, and message length
  - Success message on valid submit
- Embedded map (OpenStreetMap iframe) and bakery contact details
- Scroll reveal animations using `IntersectionObserver`
- Production build support via Vite

## Tech Stack

- React 18
- Vite 5
- Plain CSS (custom theme + responsive design)

## Project Structure

```text
bakery-app/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    styles.css
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

This starts the app in development mode with hot reload.

### 3. Build for production

```bash
npm run build
```

Output is generated in the `dist/` folder.

### 4. Preview production build (optional)

```bash
npm run preview
```

## Notes

- Images are loaded from Unsplash CDN URLs.
- Cart data is saved in browser local storage using key: `golden-crumb-cart-v1`.
- Checkout currently prepares payload locally (frontend only). You can connect it to a backend API later.
