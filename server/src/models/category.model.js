import { query } from './db.js';

const allowedFields = ['name', 'slug', 'image_url', 'parent_id', 'sort_order', 'is_active'];

export async function listAll() {
  const result = await query(
    `SELECT *
     FROM categories
     ORDER BY sort_order ASC, name ASC`,
  );
  return result.rows;
}

export async function findById(id) {
  const result = await query('SELECT * FROM categories WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}

export async function findBySlug(slug) {
  const result = await query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
  return result.rows[0] || null;
}

export async function create(data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key));
  const columns = entries.map(([key]) => key);
  const placeholders = entries.map((_, index) => `$${index + 1}`);
  const values = entries.map(([, value]) => value);

  const result = await query(
    `INSERT INTO categories (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values,
  );
  return result.rows[0];
}

export async function update(id, data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key));

  if (entries.length === 0) {
    return findById(id);
  }

  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  const values = entries.map(([, value]) => value);
  const result = await query(
    `UPDATE categories
     SET ${assignments.join(', ')}
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}

export async function deleteCategory(id) {
  const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

export { deleteCategory as delete };
