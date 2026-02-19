import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
  featuredItems,
  galleryImages,
  orderItems,
  siteSettings,
  testimonials
} from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "..", "data", "bakery.db");

export async function initDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS featured_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      note TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      alt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      text TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      item_count INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      title TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await seedTableIfEmpty(db, "featured_items", featuredItems, (item) => [
    item.id,
    item.title,
    item.price,
    item.image
  ]);

  await seedTableIfEmpty(db, "order_items", orderItems, (item) => [
    item.id,
    item.title,
    item.note,
    item.price,
    item.image
  ]);

  await seedTableIfEmpty(db, "gallery_images", galleryImages, (item) => [item.src, item.alt]);
  await seedTableIfEmpty(db, "testimonials", testimonials, (item) => [item.name, item.text]);
  await seedSettingsIfEmpty(db, siteSettings);

  return db;
}

async function seedTableIfEmpty(db, tableName, rows, mapper) {
  const countRow = await db.get(`SELECT COUNT(*) AS count FROM ${tableName}`);
  if (countRow.count > 0) {
    return;
  }

  const placeholdersByTable = {
    featured_items: "(id, title, price, image) VALUES (?, ?, ?, ?)",
    order_items: "(id, title, note, price, image) VALUES (?, ?, ?, ?, ?)",
    gallery_images: "(src, alt) VALUES (?, ?)",
    testimonials: "(name, text) VALUES (?, ?)"
  };

  const insertSql = `INSERT INTO ${tableName} ${placeholdersByTable[tableName]}`;
  for (const row of rows) {
    await db.run(insertSql, mapper(row));
  }
}

async function seedSettingsIfEmpty(db, settings) {
  const countRow = await db.get("SELECT COUNT(*) AS count FROM site_settings");
  if (countRow.count > 0) {
    return;
  }

  for (const [key, value] of Object.entries(settings)) {
    await db.run("INSERT INTO site_settings (key, value) VALUES (?, ?)", [key, String(value)]);
  }
}
