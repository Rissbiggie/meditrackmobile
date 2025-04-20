import { pool } from './db';

async function migrate() {
  try {
    const client = await pool.connect();
    
    console.log('Adding missing columns to users table...');
    
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verification_token TEXT,
      ADD COLUMN IF NOT EXISTS verification_expiry TIMESTAMP,
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_expiry TIMESTAMP,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
    `);
    
    console.log('Migration completed successfully');
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 