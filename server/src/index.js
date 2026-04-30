import dotenv from 'dotenv';
import app from './app.js';
import { query, pool } from './models/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function start() {
  try {
    await query('SELECT 1');
    app.listen(port, () => {
      console.log('Malabarii server running');
      console.log(`   Mode:    ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port:    ${port}`);
      console.log('   DB:      connected OK');
      console.log('   Health:  /api/health');
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

start();
