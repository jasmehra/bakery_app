import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { initDb } from "./db/initDb.js";
import { swaggerSpec } from "./swaggerSpec.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const db = await initDb();

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

async function getSiteSettings() {
  const rows = await db.all("SELECT key, value FROM site_settings");
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

app.get("/api/health", async (_req, res) => {
  const row = await db.get("SELECT datetime('now') AS now");
  res.json({ ok: true, serverTime: row.now });
});

app.get("/api/content", async (_req, res) => {
  const [featuredItems, orderItems, galleryImages, testimonials, siteSettings] =
    await Promise.all([
    db.all("SELECT id, title, price, image FROM featured_items ORDER BY title ASC"),
    db.all("SELECT id, title, note, price, image FROM order_items ORDER BY title ASC"),
    db.all("SELECT id, src, alt FROM gallery_images ORDER BY id ASC"),
    db.all("SELECT id, name, text FROM testimonials ORDER BY id ASC"),
    getSiteSettings()
  ]);

  res.json({ featuredItems, orderItems, galleryImages, testimonials, siteSettings });
});

app.get("/api/featured-items", async (_req, res) => {
  const rows = await db.all("SELECT id, title, price, image FROM featured_items ORDER BY title ASC");
  res.json(rows);
});

app.get("/api/order-items", async (_req, res) => {
  const rows = await db.all("SELECT id, title, note, price, image FROM order_items ORDER BY title ASC");
  res.json(rows);
});

app.get("/api/gallery-images", async (_req, res) => {
  const rows = await db.all("SELECT id, src, alt FROM gallery_images ORDER BY id ASC");
  res.json(rows);
});

app.get("/api/testimonials", async (_req, res) => {
  const rows = await db.all("SELECT id, name, text FROM testimonials ORDER BY id ASC");
  res.json(rows);
});

app.get("/api/site-settings", async (_req, res) => {
  const settings = await getSiteSettings();
  res.json(settings);
});

app.get("/api/admin/content", async (_req, res) => {
  const [featuredItems, orderItems, galleryImages, testimonials, siteSettings] =
    await Promise.all([
      db.all("SELECT id, title, price, image FROM featured_items ORDER BY title ASC"),
      db.all("SELECT id, title, note, price, image FROM order_items ORDER BY title ASC"),
      db.all("SELECT id, src, alt FROM gallery_images ORDER BY id ASC"),
      db.all("SELECT id, name, text FROM testimonials ORDER BY id ASC"),
      getSiteSettings()
    ]);

  res.json({ featuredItems, orderItems, galleryImages, testimonials, siteSettings });
});

app.put("/api/admin/content", async (req, res) => {
  const { featuredItems, orderItems, galleryImages, testimonials, siteSettings } = req.body ?? {};

  if (
    !Array.isArray(featuredItems) ||
    !Array.isArray(orderItems) ||
    !Array.isArray(galleryImages) ||
    !Array.isArray(testimonials) ||
    !siteSettings ||
    typeof siteSettings !== "object"
  ) {
    return res.status(400).json({ error: "Invalid admin payload" });
  }

  await db.run("BEGIN TRANSACTION");
  try {
    await db.run("DELETE FROM featured_items");
    for (const item of featuredItems) {
      await db.run(
        "INSERT INTO featured_items (id, title, price, image) VALUES (?, ?, ?, ?)",
        [item.id, item.title, Number(item.price), item.image]
      );
    }

    await db.run("DELETE FROM order_items");
    for (const item of orderItems) {
      await db.run(
        "INSERT INTO order_items (id, title, note, price, image) VALUES (?, ?, ?, ?, ?)",
        [item.id, item.title, item.note, Number(item.price), item.image]
      );
    }

    await db.run("DELETE FROM gallery_images");
    for (const item of galleryImages) {
      await db.run("INSERT INTO gallery_images (src, alt) VALUES (?, ?)", [item.src, item.alt]);
    }

    await db.run("DELETE FROM testimonials");
    for (const item of testimonials) {
      await db.run("INSERT INTO testimonials (name, text) VALUES (?, ?)", [item.name, item.text]);
    }

    for (const [key, value] of Object.entries(siteSettings)) {
      await db.run(
        "INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [key, String(value)]
      );
    }

    await db.run("COMMIT");
    return res.json({ ok: true });
  } catch (error) {
    await db.run("ROLLBACK");
    return res.status(500).json({ error: "Failed to update content", detail: error.message });
  }
});

app.get("/api/orders", async (_req, res) => {
  const orders = await db.all(
    "SELECT id, order_id AS orderId, customer_name AS customerName, customer_phone AS customerPhone, pickup_time AS pickupTime, item_count AS itemCount, subtotal, created_at AS createdAt FROM orders ORDER BY id DESC"
  );
  res.json(orders);
});

app.post("/api/orders", async (req, res) => {
  const { orderId, customer, pickupTime, items, totals, createdAt } = req.body ?? {};

  if (!orderId || !customer?.name || !customer?.phone || !pickupTime || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const itemCount = Number(totals?.itemCount ?? 0);
  const subtotal = Number(totals?.subtotal ?? 0);

  await db.run("BEGIN TRANSACTION");
  try {
    await db.run(
      "INSERT INTO orders (order_id, customer_name, customer_phone, pickup_time, item_count, subtotal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [orderId, customer.name, customer.phone, pickupTime, itemCount, subtotal, createdAt ?? new Date().toISOString()]
    );

    for (const item of items) {
      await db.run(
        "INSERT INTO order_items_log (order_id, item_id, title, qty, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.id, item.title, item.qty, item.unitPrice, item.lineTotal]
      );
    }

    await db.run("COMMIT");
    return res.status(201).json({ ok: true, orderId });
  } catch (error) {
    await db.run("ROLLBACK");
    return res.status(500).json({ error: "Failed to create order", detail: error.message });
  }
});

app.post("/api/contact-messages", async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Invalid contact payload" });
  }

  await db.run(
    "INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, ?)",
    [name.trim(), email.trim(), message.trim(), new Date().toISOString()]
  );

  return res.status(201).json({ ok: true });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bakery API running at http://0.0.0.0:${PORT}`);
});
