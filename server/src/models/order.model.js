import { query, withTransaction } from './db.js';

const orderFields = [
  'order_number',
  'user_id',
  'address_id',
  'status',
  'subtotal',
  'delivery_fee',
  'discount_amount',
  'total',
  'offer_id',
  'razorpay_order_id',
  'razorpay_payment_id',
  'payment_status',
  'payment_method',
  'is_hotel_order',
  'delivery_slot',
  'gst_invoice_url',
  'notes',
];

const itemFields = [
  'product_id',
  'vendor_id',
  'name',
  'price',
  'quantity',
  'selected_weight',
  'cleaning_option',
  'unit_multiplier',
  'subtotal',
];

export async function generateOrderNumber() {
  const dateResult = await query(`SELECT TO_CHAR(NOW(), 'YYMMDD') AS stamp`);
  const stamp = dateResult.rows[0].stamp;
  const countResult = await query(
    `SELECT COUNT(*)::int AS count
     FROM orders
     WHERE order_number LIKE $1`,
    [`MB${stamp}%`],
  );
  const sequence = String(countResult.rows[0].count + 1).padStart(3, '0');
  return `MB${stamp}${sequence}`;
}

export async function create(orderData, items = []) {
  return withTransaction(async (client) => {
    const orderNumber = orderData.order_number || (await generateOrderNumber());
    const normalizedOrder = { ...orderData, order_number: orderNumber };
    const orderEntries = Object.entries(normalizedOrder).filter(([key]) => orderFields.includes(key));
    const orderColumns = orderEntries.map(([key]) => key);
    const orderPlaceholders = orderEntries.map((_, index) => `$${index + 1}`);
    const orderValues = orderEntries.map(([, value]) => value);

    const orderResult = await client.query(
      `INSERT INTO orders (${orderColumns.join(', ')})
       VALUES (${orderPlaceholders.join(', ')})
       RETURNING *`,
      orderValues,
    );
    const order = orderResult.rows[0];

    const createdItems = [];
    for (const item of items) {
      const itemEntries = Object.entries(item).filter(([key]) => itemFields.includes(key));
      const columns = ['order_id', ...itemEntries.map(([key]) => key)];
      const values = [order.id, ...itemEntries.map(([, value]) => value)];
      const placeholders = values.map((_, index) => `$${index + 1}`);

      const itemResult = await client.query(
        `INSERT INTO order_items (${columns.join(', ')})
         VALUES (${placeholders.join(', ')})
         RETURNING *`,
        values,
      );
      createdItems.push(itemResult.rows[0]);
    }

    return { ...order, items: createdItems };
  });
}

export async function findById(id) {
  const orderResult = await query('SELECT * FROM orders WHERE id = $1 LIMIT 1', [id]);
  const order = orderResult.rows[0] || null;

  if (!order) {
    return null;
  }

  const itemResult = await query(
    `SELECT *
     FROM order_items
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [id],
  );

  return { ...order, items: itemResult.rows };
}

export async function findByUser(userId) {
  const result = await query(
    `SELECT *
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows;
}

export async function findByUserPaged(userId, { status, limit = 20, offset = 0 } = {}) {
  const values = [userId];
  const where = ['user_id = $1'];

  if (status) {
    values.push(status);
    where.push(`status = $${values.length}`);
  }

  const countResult = await query(
    `SELECT COUNT(*)::int AS total FROM orders WHERE ${where.join(' AND ')}`,
    values,
  );
  const result = await query(
    `SELECT *
     FROM orders
     WHERE ${where.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );

  return { orders: result.rows, total: countResult.rows[0].total };
}

export async function findByVendor(vendorId) {
  const result = await query(
    `SELECT DISTINCT o.*
     FROM orders o
     INNER JOIN order_items oi ON oi.order_id = o.id
     WHERE oi.vendor_id = $1
     ORDER BY o.created_at DESC`,
    [vendorId],
  );
  return result.rows;
}

export async function findByVendorPaged(vendorId, { status, limit = 20, offset = 0 } = {}) {
  const values = [vendorId];
  const where = ['oi.vendor_id = $1'];

  if (status) {
    values.push(status);
    where.push(`o.status = $${values.length}`);
  }

  const result = await query(
    `SELECT DISTINCT o.*
     FROM orders o
     INNER JOIN order_items oi ON oi.order_id = o.id
     WHERE ${where.join(' AND ')}
     ORDER BY o.created_at DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );
  return result.rows;
}

export async function updateStatus(id, status) {
  const result = await query(
    `UPDATE orders
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status],
  );
  return result.rows[0] || null;
}

export async function update(id, data) {
  const entries = Object.entries(data).filter(([key]) => orderFields.includes(key));

  if (entries.length === 0) {
    return findById(id);
  }

  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  const values = entries.map(([, value]) => value);
  const result = await query(
    `UPDATE orders
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, ...values],
  );
  return result.rows[0] || null;
}
