import { query } from './db.js';

export async function create({ mobile, otp_hash, purpose, expires_at }) {
  const result = await query(
    `INSERT INTO otp_logs (mobile, otp_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [mobile, otp_hash, purpose, expires_at],
  );
  return result.rows[0];
}

export async function findValid(mobile, purpose) {
  const result = await query(
    `SELECT *
     FROM otp_logs
     WHERE mobile = $1
       AND purpose = $2
       AND verified = false
       AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [mobile, purpose],
  );
  return result.rows[0] || null;
}

export async function markVerified(id) {
  const result = await query(
    `UPDATE otp_logs
     SET verified = true
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0] || null;
}

export async function deleteExpired() {
  const result = await query('DELETE FROM otp_logs WHERE expires_at <= NOW() RETURNING id');
  return result.rowCount;
}

export async function countRecentByMobile(mobile, minutes = 10) {
  const result = await query(
    `SELECT COUNT(*)::int AS count
     FROM otp_logs
     WHERE mobile = $1
       AND created_at >= NOW() - ($2::int * INTERVAL '1 minute')`,
    [mobile, minutes],
  );
  return result.rows[0].count;
}
