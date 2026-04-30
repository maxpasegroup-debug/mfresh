import { query } from './db.js';

const allowedFields = [
  'user_id',
  'shop_name',
  'description',
  'logo_url',
  'address',
  'city',
  'pincode',
  'gst_number',
  'commission_pct',
  'bank_account_name',
  'bank_account_number',
  'bank_ifsc',
  'razorpay_contact_id',
  'razorpay_fund_account_id',
  'rating',
  'total_orders',
  'is_active',
  'is_approved',
];

function buildInsert(data) {
  const entries = Object.entries(data).filter(([key]) => allowedFields.includes(key));
  const columns = entries.map(([key]) => key);
  const placeholders = entries.map((_, index) => `$${index + 1}`);
  const values = entries.map(([, value]) => value);
  return { columns, placeholders, values };
}

export async function findById(id) {
  const result = await query('SELECT * FROM vendors WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
}

export async function findByUserId(userId) {
  const result = await query('SELECT * FROM vendors WHERE user_id = $1 LIMIT 1', [userId]);
  return result.rows[0] || null;
}

export async function create(data) {
  const { columns, placeholders, values } = buildInsert(data);
  const result = await query(
    `INSERT INTO vendors (${columns.join(', ')})
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
    `UPDATE vendors
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}

export async function listActive() {
  const result = await query(
    `SELECT *
     FROM vendors
     WHERE is_active = true AND is_approved = true
     ORDER BY shop_name ASC`,
  );
  return result.rows;
}

export async function listAll() {
  const result = await query('SELECT * FROM vendors ORDER BY created_at DESC');
  return result.rows;
}

export async function dashboardStats(vendorId) {
  const result = await query(
    `SELECT
       COALESCE(COUNT(DISTINCT o.id) FILTER (WHERE o.created_at::date = CURRENT_DATE), 0)::int AS today_orders,
       COALESCE(SUM(oi.subtotal) FILTER (WHERE o.created_at::date = CURRENT_DATE), 0)::numeric AS today_revenue,
       COALESCE(COUNT(DISTINCT o.id) FILTER (WHERE o.created_at >= date_trunc('week', NOW())), 0)::int AS week_orders,
       COALESCE(SUM(oi.subtotal) FILTER (WHERE o.created_at >= date_trunc('week', NOW())), 0)::numeric AS week_revenue,
       COALESCE(COUNT(DISTINCT o.id) FILTER (WHERE o.created_at >= date_trunc('month', NOW())), 0)::int AS month_orders,
       COALESCE(SUM(oi.subtotal) FILTER (WHERE o.created_at >= date_trunc('month', NOW())), 0)::numeric AS month_revenue,
       COALESCE(COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'pending'), 0)::int AS pending_orders,
       (SELECT COUNT(*)::int FROM products WHERE vendor_id = $1 AND is_active = true) AS total_products
     FROM order_items oi
     INNER JOIN orders o ON o.id = oi.order_id
     WHERE oi.vendor_id = $1`,
    [vendorId],
  );
  return result.rows[0];
}
