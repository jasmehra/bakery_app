# Golden Crumb Bakery App

Full-stack bakery app using React (frontend) + Node.js/Express (backend) + SQLite (database).

## Working Features

- Responsive bakery website UI (hero, menu, story, gallery, testimonials, contact)
- Multi-component React structure
- Backend-driven content: featured items, order items, gallery images, testimonials
- Admin page to edit all website text/content from UI
- SQLite database auto-created and auto-seeded on backend startup
- Swagger API docs for testing endpoints
- Online ordering flow:
  - Add/remove cart items
  - Cart persisted in browser `localStorage`
  - Checkout validation
  - Checkout submits order to backend API
  - Orders saved in SQLite (`orders`, `order_items_log`)
- Contact form:
  - Frontend validation
  - Submits to backend API
  - Messages saved in SQLite (`contact_messages`)
- Scroll reveal animations

## Tech Stack

- Frontend: React 18, Vite 5
- Backend: Node.js, Express 4
- Database: SQLite (`sqlite3` + `sqlite`)

## Project Structure

```text
bakery-app/
  server/
    index.js
    data/
      bakery.db          # auto-created
    db/
      initDb.js
      seedData.js
  src/
    main.jsx
    App.jsx
    apiClient.js
    components/
      Header.jsx
      HeroSection.jsx
      FeaturedMenuSection.jsx
      OrderSection.jsx
      StorySection.jsx
      GallerySection.jsx
      TestimonialsSection.jsx
      ContactSection.jsx
    utils/
      cartStorage.js
    styles.css
  index.html
  package.json
  vite.config.js
```

## API Endpoints

- `GET /api/health`
- `GET /api-docs` (Swagger UI)
- `GET /api-docs.json` (OpenAPI spec JSON)
- `GET /api/content`
- `GET /api/site-settings`
- `GET /api/admin/content`
- `PUT /api/admin/content`
- `GET /api/featured-items`
- `GET /api/order-items`
- `GET /api/gallery-images`
- `GET /api/testimonials`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/contact-messages`

## Setup and Run

### 1. Install dependencies

```bash
npm install
```

### 2. Run frontend + backend together (recommended)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Swagger docs: `http://localhost:4000/api-docs`
- Admin page: `http://localhost:5173/admin`

### 3. Run only backend

```bash
npm run dev:server
```

### 4. Run only frontend

```bash
npm run dev:client
```

### 5. Build frontend

```bash
npm run build
```

### 6. Preview frontend build

```bash
npm run preview
```

## Notes

- Vite proxy is configured so frontend calls to `/api/*` go to backend `http://localhost:4000` in dev.
- SQLite database file is created at `server/data/bakery.db` automatically.
- To use another API base URL, set `VITE_API_BASE_URL`.
