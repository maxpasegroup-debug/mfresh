import bcrypt from 'bcrypt';
import { query, pool } from '../models/db.js';

const [, , mobile, pin] = process.argv;

if (!mobile || !pin) {
  console.error('Usage: node createAdmin.js <mobile> <pin>');
  process.exit(1);
}

async function createAdmin() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required');
    }

    if (!/^\d{10}$/.test(mobile)) {
      throw new Error('Mobile must be exactly 10 digits');
    }

    if (!/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be exactly 4 digits');
    }

    const existing = await query('SELECT id FROM users WHERE mobile = $1 LIMIT 1', [mobile]);

    if (existing.rows[0]) {
      throw new Error(`User already exists: ${mobile}`);
    }

    const pinHash = await bcrypt.hash(pin, 12);

    await query(
      `INSERT INTO users (mobile, name, role, pin_hash)
       VALUES ($1, 'Admin', 'admin', $2)`,
      [mobile, pinHash],
    );

    console.log(`Admin created: ${mobile}`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Create admin failed:', error.message || String(error));
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

createAdmin();
