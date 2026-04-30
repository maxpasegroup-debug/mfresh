import bcrypt from 'bcrypt';
import * as userModel from '../models/user.model.js';
import * as vendorModel from '../models/vendor.model.js';
import { query } from '../models/db.js';
import { sendOtp } from '../services/otp.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export const getStats = asyncHandler(async (_req, res) => {
  const aggregate = await query(
    `SELECT
       COUNT(*) FILTER (WHERE o.created_at::date = CURRENT_DATE)::int AS today_orders,
       COALESCE(SUM(o.total) FILTER (WHERE o.created_at::date = CURRENT_DATE), 0)::numeric AS today_revenue,
       COUNT(*) FILTER (WHERE o.created_at >= date_trunc('week', NOW()))::int AS week_orders,
       COALESCE(SUM(o.total) FILTER (WHERE o.created_at >= date_trunc('week', NOW())), 0)::numeric AS week_revenue,
       COUNT(*) FILTER (WHERE o.created_at >= date_trunc('month', NOW()))::int AS month_orders,
       COALESCE(SUM(o.total) FILTER (WHERE o.created_at >= date_trunc('month', NOW())), 0)::numeric AS month_revenue,
       COUNT(*)::int AS total_orders,
       COALESCE(SUM(o.total), 0)::numeric AS total_revenue
     FROM orders o`,
  );
  const counts = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM users) AS total_users,
       (SELECT COUNT(*)::int FROM vendors) AS total_vendors,
       (SELECT COUNT(*)::int FROM products) AS total_products,
       (SELECT COUNT(*)::int FROM vendors WHERE is_approved = false) AS pending_vendor_approvals`,
  );
  const recent = await query(
    `SELECT o.*, u.name AS user_name, u.mobile AS user_mobile
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC
     LIMIT 5`,
  );

  const row = aggregate.rows[0];
  res.json({
    today: { orders: row.today_orders, revenue: Number(row.today_revenue) },
    week: { orders: row.week_orders, revenue: Number(row.week_revenue) },
    month: { orders: row.month_orders, revenue: Number(row.month_revenue) },
    total_orders: row.total_orders,
    total_revenue: Number(row.total_revenue),
    ...counts.rows[0],
    recent_orders: recent.rows,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const values = [];
  const where = [];

  if (req.query.status) {
    values.push(req.query.status);
    where.push(`o.status = $${values.length}`);
  }
  if (req.query.search) {
    values.push(`%${req.query.search}%`);
    where.push(`(o.order_number ILIKE $${values.length} OR u.mobile ILIKE $${values.length})`);
  }
  if (req.query.date_from) {
    values.push(req.query.date_from);
    where.push(`o.created_at >= $${values.length}`);
  }
  if (req.query.date_to) {
    values.push(req.query.date_to);
    where.push(`o.created_at <= $${values.length}`);
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const count = await query(`SELECT COUNT(*)::int AS total FROM orders o LEFT JOIN users u ON u.id = o.user_id ${clause}`, values);
  const result = await query(
    `SELECT o.*, u.name AS user_name, u.mobile AS user_mobile
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ${clause}
     ORDER BY o.created_at DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, (page - 1) * limit],
  );
  res.json({ orders: result.rows, total: count.rows[0].total, page });
});

export const getVendors = asyncHandler(async (_req, res) => {
  const vendors = await vendorModel.listAll();
  res.json({ vendors, total: vendors.length });
});

export const adminOnboardVendor = asyncHandler(async (req, res) => {
  const { mobile, owner_name, shop_name, city, pincode, commission_pct, gst_number } = req.body;
  if (!/^\d{10}$/.test(mobile || '')) throw httpError(400, 'Valid mobile is required');
  if (!owner_name || !shop_name) throw httpError(400, 'Owner and shop name are required');

  let user = await userModel.findByMobile(mobile);
  if (!user) {
    const pin_hash = await bcrypt.hash('0000', 12);
    user = await userModel.create({
      mobile,
      name: owner_name,
      pin_hash,
      role: 'vendor',
      mode: 'individual',
    });
  } else {
    user = await userModel.updateProfile(user.id, { role: 'vendor' });
  }

  const vendor = await vendorModel.create({
    user_id: user.id,
    shop_name,
    city,
    pincode,
    commission_pct: commission_pct || 8,
    gst_number,
    is_approved: true,
    is_active: true,
  });
  await sendOtp(mobile, '000000');
  res.status(201).json({ vendor, user });
});

export const getSettings = asyncHandler((_req, res) => {
  res.json({
    delivery: { free_delivery_min: 199, default_delivery_fee: 30, zones: ['Kochi'] },
    payment: {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing',
      mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      webhook_url: '/api/payments/webhook',
    },
    notifications: { msg91_sender_id: process.env.MSG91_SENDER_ID || '' },
    app: { version: '0.1.0', schema_version: '1', uptime: process.uptime() },
  });
});

export const updateSettings = asyncHandler((req, res) => {
  res.json({ settings: req.body });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { mobile, name } = req.body;
  if (!/^\d{10}$/.test(mobile || '')) throw httpError(400, 'Valid mobile is required');
  const existing = await userModel.findByMobile(mobile);
  if (existing) {
    const user = await userModel.updateProfile(existing.id, { role: 'admin' });
    return res.json({ user });
  }
  const pin_hash = await bcrypt.hash('0000', 12);
  const user = await userModel.create({ mobile, name: name || 'Admin', pin_hash, role: 'admin' });
  return res.status(201).json({ user });
});
