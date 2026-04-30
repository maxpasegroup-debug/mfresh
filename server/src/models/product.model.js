import { query } from './db.js';

const allowedFields = [
  'vendor_id',
  'category_id',
  'name',
  'slug',
  'description',
  'images',
  'price',
  'mrp',
  'unit',
  'stock',
  'is_active',
  'is_featured',
];

export async function listByCategory(categoryId, limit = 20, offset = 0) {
  const result = await query(
    `SELECT *
     FROM products
     WHERE category_id = $1 AND is_active = true
     ORDER BY is_featured DESC, name ASC
     LIMIT $2 OFFSET $3`,
    [categoryId, limit, offset],
  );
  return result.rows;
}

export async function list({
  categoryId,
  categorySlug,
  vendorId,
  search,
  featured,
  limit = 20,
  offset = 0,
  sort = 'newest',
} = {}) {
  const where = ['p.is_active = true'];
  const values = [];

  if (categoryId) {
    values.push(categoryId);
    where.push(`p.category_id = $${values.length}`);
  }

  if (categorySlug) {
    values.push(categorySlug);
    where.push(`c.slug = $${values.length}`);
  }

  if (vendorId) {
    values.push(vendorId);
    where.push(`p.vendor_id = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    where.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }

  if (featured !== undefined) {
    values.push(featured);
    where.push(`p.is_featured = $${values.length}`);
  }

  const orderBy =
    {
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      newest: 'p.created_at DESC',
    }[sort] || 'p.created_at DESC';

  const countResult = await query(
    `SELECT COUNT(*)::int AS total
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE ${where.join(' AND ')}`,
    values,
  );

  const result = await query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug, v.shop_name AS vendor_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN vendors v ON v.id = p.vendor_id
     WHERE ${where.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );

  return { products: result.rows, total: countResult.rows[0].total };
}

export async function listByVendor(vendorId) {
  const result = await query(
    `SELECT *
     FROM products
     WHERE vendor_id = $1
     ORDER BY created_at DESC`,
    [vendorId],
  );
  return result.rows;
}

export async function findById(id) {
  const result = await query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}

export async function findByIdWithVendor(id) {
  const result = await query(
    `SELECT p.*, v.shop_name AS vendor_name, v.logo_url AS vendor_logo_url, v.rating AS vendor_rating
     FROM products p
     LEFT JOIN vendors v ON v.id = p.vendor_id
     WHERE p.id = $1
     LIMIT 1`,
    [id],
  );
  return result.rows[0] || null;
}

export async function findManyByIds(ids) {
  const result = await query(
    `SELECT *
     FROM products
     WHERE id = ANY($1::uuid[])`,
    [ids],
  );
  return result.rows;
}

export async function countActiveByCategory(categoryId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count
     FROM products
     WHERE category_id = $1 AND is_active = true`,
    [categoryId],
  );
  return result.rows[0].count;
}

export async function search(searchQuery) {
  const result = await query(
    `SELECT *
     FROM products
     WHERE is_active = true
       AND (name ILIKE $1 OR description ILIKE $1)
     ORDER BY is_featured DESC, name ASC
     LIMIT 50`,
    [`%${searchQuery}%`],
  );
  return result.rows;
}

export async function create(data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key));
  const columns = entries.map(([key]) => key);
  const placeholders = entries.map((_, index) => `$${index + 1}`);
  const values = entries.map(([, value]) => (Array.isArray(value) ? JSON.stringify(value) : value));

  const result = await query(
    `INSERT INTO products (${columns.join(', ')})
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
  const values = entries.map(([, value]) => (Array.isArray(value) ? JSON.stringify(value) : value));
  const result = await query(
    `UPDATE products
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}

export async function updateStock(id, qty) {
  const result = await query(
    `UPDATE products
     SET stock = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, qty],
  );
  return result.rows[0] || null;
}

export async function adjustStock(id, delta) {
  const result = await query(
    `UPDATE products
     SET stock = stock + $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, delta],
  );
  return result.rows[0] || null;
}

export async function getProducts() {
  const result = await query(
    `SELECT id, name, price, unit
     FROM products
     WHERE is_active = true
     ORDER BY name ASC`,
  );
  return result.rows;
}
