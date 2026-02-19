# Golden Crumb Bakery App

Full-stack bakery app using React (frontend) + Node.js/Express (backend) + SQLite (database).

## Working Features

- Responsive bakery website UI (hero, menu, story, gallery, testimonials, contact)
- Multi-component React structure
- Backend-driven content from SQLite: featured items, order items, gallery images, testimonials, and editable site text
- Admin page to edit all visible website content and copy from one place
- SQLite database auto-created and auto-seeded on backend startup
- Swagger API docs for API testing
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
- API Docs: Swagger UI (`swagger-ui-express`)

## Project Structure

```text
bakery-app/
  server/
    index.js
    swaggerSpec.js
    data/
      bakery.db                # auto-created
    db/
      initDb.js
      seedData.js
  src/
    main.jsx
    App.jsx
    apiClient.js
    components/
      AdminPage.jsx
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
  .gitignore
  README.md
```

## API Endpoints

- `GET /api/health`
- `GET /api-docs` (Swagger UI)
- `GET /api-docs.json` (OpenAPI JSON)
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

## Admin Usage

- Open `http://localhost:5173/admin`
- Edit:
  - Site text settings (headings, labels, button text, map/contact text)
  - Featured items
  - Order items
  - Gallery images
  - Testimonials
- Click `Save All Changes` to persist updates via `PUT /api/admin/content`

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
- Admin page: `http://localhost:5173/admin`
- Backend API: `http://localhost:4000`
- Swagger docs: `http://localhost:4000/api-docs`

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

### 7. Run backend in production mode (optional)

```bash
npm run start
```

## Notes

- Vite proxy routes `/api/*` to `http://localhost:4000` in development.
- SQLite DB file is created automatically at `server/data/bakery.db`.
- To use another API base URL, set `VITE_API_BASE_URL`.

## Deployment

### Option 1: Single VM / VPS (recommended for SQLite)

Run frontend and backend on the same machine:

1. Build frontend:

```bash
npm install
npm run build
```

2. Run backend in production:

```bash
npm run start
```

3. Serve `dist/` with Nginx (or any static server), and reverse-proxy `/api` to `http://localhost:4000`.

Why this option:
- SQLite is file-based and works best when backend and DB file stay on one persistent server.

### Option 2: Split Hosting

- Frontend: deploy `dist/` to Vercel/Netlify/Cloudflare Pages.
- Backend: deploy Node API to a server/platform with persistent disk.
- Set frontend env:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Important:
- If backend URL changes, rebuild frontend with the new `VITE_API_BASE_URL`.
- Do not deploy SQLite DB to ephemeral filesystems.
