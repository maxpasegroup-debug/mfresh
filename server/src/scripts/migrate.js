import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from '../models/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  console.log('Running Malabarii migrations...');

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required to run migrations');
    }

    const sql = readFileSync(join(__dirname, '../models/schema.sql'), 'utf8');
    const statements = sql
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)
      .filter((statement) => !statement.toUpperCase().startsWith('INSERT'));

    for (const statement of statements) {
      await query(statement);
      const type = statement.split('\n')[0].trim();
      console.log(`  OK ${type.substring(0, 60)}`);
    }

    console.log('Migration complete!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err.code || String(err));
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

migrate();
