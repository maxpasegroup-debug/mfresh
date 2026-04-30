import { query } from './db.js';

const fields = [
  'title',
  'type',
  'code',
  'discount_pct',
  'discount_flat',
  'min_order_value',
  'max_discount',
  'applies_to',
  'reference_id',
  'valid_from',
  'valid_to',
  'usage_limit',
  'usage_count',
  'is_active',
];

function mutationParts(data, start = 1) {
  const entries = Object.entries(data).filter(([key]) => fields.includes(key));
  return {
    entries,
    columns: entries.map(([key]) => key),
    values: entries.map(([, value]) => value),
    placeholders: entries.map((_, index) => `$${index + start}`),
  };
}

export async function listActive() {
  const result = await query(
    `SELECT * FROM offers
     WHERE is_active = true
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_to IS NULL OR valid_to >= NOW())
     ORDER BY created_at DESC`,
  );
  return result.rows;
}

export async function listAll() {
  const result = await query('SELECT * FROM offers ORDER BY created_at DESC');
  return result.rows;
}

export async function findById(id) {
  const result = await query('SELECT * FROM offers WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}

export async function findByCode(code) {
  const result = await query('SELECT * FROM offers WHERE code = $1 LIMIT 1', [code]);
  return result.rows[0] || null;
}

export async function findActiveByCode(code) {
  const result = await query(
    `SELECT * FROM offers
     WHERE code = $1 AND is_active = true
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_to IS NULL OR valid_to >= NOW())
     LIMIT 1`,
    [code],
  );
  return result.rows[0] || null;
}

export async function create(data) {
  const { columns, placeholders, values } = mutationParts(data);
  const result = await query(
    `INSERT INTO offers (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values,
  );
  return result.rows[0];
}

export async function update(id, data) {
  const { entries, values } = mutationParts(data, 2);
  if (entries.length === 0) return findById(id);
  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  const result = await query(
    `UPDATE offers SET ${assignments.join(', ')}
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}

export async function deleteOffer(id) {
  const result = await query('DELETE FROM offers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

export async function incrementUsage(id) {
  const result = await query(
    `UPDATE offers
     SET usage_count = usage_count + 1
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0] || null;
}

export { deleteOffer as delete };
