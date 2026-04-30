import { query } from './db.js';

const allowedProfileFields = ['name', 'email', 'role', 'mode', 'fcm_token', 'is_active'];

export async function findByMobile(mobile) {
  const result = await query('SELECT * FROM users WHERE mobile = $1 LIMIT 1', [mobile]);
  return result.rows[0] || null;
}

export async function findById(id) {
  const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}

export async function create({ mobile, name, pin_hash, role = 'user', mode = 'individual' }) {
  const result = await query(
    `INSERT INTO users (mobile, name, pin_hash, role, mode)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [mobile, name, pin_hash, role, mode],
  );
  return result.rows[0];
}

export async function updatePin(id, pin_hash) {
  const result = await query(
    `UPDATE users
     SET pin_hash = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, pin_hash],
  );
  return result.rows[0] || null;
}

export async function updateProfile(id, data) {
  const entries = Object.entries(data).filter(([key]) => allowedProfileFields.includes(key));

  if (entries.length === 0) {
    return findById(id);
  }

  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  const values = entries.map(([, value]) => value);

  const result = await query(
    `UPDATE users
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );

  return result.rows[0] || null;
}
