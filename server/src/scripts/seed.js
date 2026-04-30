import bcrypt from 'bcrypt';
import { query, pool } from '../models/db.js';

const categories = [
  ['Dairy', 'dairy', 'milk', 1],
  ['Vegetables', 'vegetables', 'leafy', 2],
  ['Fruits', 'fruits', 'banana', 3],
  ['Oils & Ghee', 'oils-ghee', 'oil', 4],
  ['Grains & Rice', 'grains-rice', 'rice', 5],
  ['Eggs', 'eggs', 'egg', 6],
  ['Spices', 'spices', 'spice', 7],
  ['Hygiene', 'hygiene', 'soap', 8],
];

const products = [
  ['Thiruvizha Fresh Milk 500ml', 'dairy', 34, 40, '500ml'],
  ['Palakkad Tomatoes 1kg', 'vegetables', 42, 55, '1kg'],
  ['Wayanad Banana 1 Dozen', 'fruits', 58, 70, '12 pcs'],
  ['Malabar Coconut Oil 500ml', 'oils-ghee', 155, 180, '500ml'],
  ['Matta Rice 5kg', 'grains-rice', 285, 330, '5kg'],
  ['Country Eggs 12pcs', 'eggs', 96, 110, '12 pcs'],
  ['Kerala Black Pepper 100g', 'spices', 125, 150, '100g'],
  ['Natural Handwash 500ml', 'hygiene', 89, 110, '500ml'],
];

async function seed() {
  console.log('Seeding Malabarii database...');

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
       VALUES ('9888888888', 'Sample Vendor', 'vendor', $1)
       RETURNING id`,
      [vendorPinHash],
    );
    const vendor = await query(
      `INSERT INTO vendors (user_id, shop_name, city, pincode, is_active, is_approved)
       VALUES ($1, 'Malabar Fresh Mart', 'Kozhikode', '673001', true, true)
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
          `Fresh ${name} from trusted Malabar suppliers`,
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
