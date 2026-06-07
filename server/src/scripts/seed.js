import bcrypt from 'bcrypt';
import { query, pool } from '../models/db.js';

const categories = [
  ['Fresh Fish', 'fresh-fish', 'fish', 1],
  ['Prawns & Shrimp', 'prawns-shrimp', 'prawns', 2],
  ['Crab & Shellfish', 'crab-shellfish', 'crab', 3],
  ['Squid & Cuttlefish', 'squid-cuttlefish', 'squid', 4],
  ['Premium Cuts', 'premium-cuts', 'seer', 5],
  ['Family Combos', 'family-combos', 'combo', 6],
  ['Curry Cuts', 'curry-cuts', 'curry', 7],
  ['Dry Fish', 'dry-fish', 'dry', 8],
  ['MFresh Pickles', 'mfresh-pickles', 'pickle', 9],
];

const products = [
  ['Seer Fish', 'premium-cuts', 780, 860, '1kg'],
  ['Pearl Spot Karimeen', 'fresh-fish', 520, 600, '1kg'],
  ['Sardine Mathi', 'fresh-fish', 180, 220, '1kg'],
  ['King Prawns', 'prawns-shrimp', 640, 720, '1kg'],
  ['Fresh Crab', 'crab-shellfish', 460, 540, '1kg'],
  ['Squid', 'squid-cuttlefish', 420, 490, '1kg'],
  ['Curry Cut Fish Combo', 'family-combos', 350, 420, '1kg'],
  ['Dry Anchovy', 'dry-fish', 260, 320, '1kg'],
  ['MFresh Fish Pickle 250g', 'mfresh-pickles', 220, 260, '250g'],
  ['MFresh Prawn Pickle 250g', 'mfresh-pickles', 280, 340, '250g'],
  ['MFresh Tuna Pickle 250g', 'mfresh-pickles', 240, 300, '250g'],
];

async function seed() {
  console.log('Seeding MFresh database...');

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required to seed the database');
    }

    const existing = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
    if (existing.rows[0].count > 0) {
      console.log('Database already seeded');
      await pool.end();
      process.exit(0);
    }

    const adminMobile = process.env.ADMIN_MOBILE || '9999999999';
    const adminPin = process.env.ADMIN_PIN || '0000';
    const pinHash = await bcrypt.hash(adminPin, 12);

    await query(
      `INSERT INTO users (mobile, name, role, pin_hash)
       VALUES ($1, 'Super Admin', 'admin', $2)
       ON CONFLICT (mobile) DO NOTHING`,
      [adminMobile, pinHash],
    );
    console.log('  OK admin user');

    for (const [name, slug, emoji, sortOrder] of categories) {
      await query(
        `INSERT INTO categories (name, slug, image_url, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug, emoji, sortOrder],
      );
    }
    console.log('  OK default categories');

    const vendorPinHash = await bcrypt.hash('1234', 12);
    const vendorUser = await query(
      `INSERT INTO users (mobile, name, role, pin_hash)
       VALUES ('9888888888', 'MFresh Operations', 'vendor', $1)
       RETURNING id`,
      [vendorPinHash],
    );
    const vendor = await query(
      `INSERT INTO vendors (user_id, shop_name, city, pincode, is_active, is_approved)
       VALUES ($1, 'MFresh Seafood Hub', 'Kochi', '682001', true, true)
       RETURNING id`,
      [vendorUser.rows[0].id],
    );
    console.log('  OK sample vendor');

    for (const [name, categorySlug, price, mrp, unit] of products) {
      const category = await query('SELECT id FROM categories WHERE slug = $1 LIMIT 1', [categorySlug]);
      await query(
        `INSERT INTO products
         (vendor_id, category_id, name, slug, description, price, mrp, unit, stock, is_active, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 100, true, true)`,
        [
          vendor.rows[0].id,
          category.rows[0].id,
          name,
          `${categorySlug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          `Fresh ${name} sourced daily, cleaned to customer preference, and packed chilled by MFresh.`,
          price,
          mrp,
          unit,
        ],
      );
    }
    console.log('  OK sample products');

    console.log('Seed complete!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message || err.code || String(err));
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

seed();
