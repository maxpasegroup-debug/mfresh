import { query, withTransaction } from './db.js';

const allowedFields = ['user_id', 'label', 'line1', 'line2', 'city', 'pincode', 'lat', 'lng', 'is_default'];

export async function findByUser(userId) {
  const result = await query(
    `SELECT *
     FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, created_at DESC`,
    [userId],
  );
  return result.rows;
}

export async function create(data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key));
  const columns = entries.map(([key]) => key);
  const values = entries.map(([, value]) => value);
  const placeholders = values.map((_, index) => `$${index + 1}`);

  const result = await query(
    `INSERT INTO addresses (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values,
  );
  return result.rows[0];
}

export async function update(id, data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key) && key !== 'user_id');

  if (entries.length === 0) {
    const result = await query('SELECT * FROM addresses WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
  }

  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  const values = entries.map(([, value]) => value);
  const result = await query(
    `UPDATE addresses
     SET ${assignments.join(', ')}
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}

export async function deleteAddress(id) {
  const result = await query('DELETE FROM addresses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

export async function setDefault(id, userId) {
  return withTransaction(async (client) => {
    await client.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    const result = await client.query(
      `UPDATE addresses
       SET is_default = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId],
    );
    return result.rows[0] || null;
  });
}

export { deleteAddress as delete };
