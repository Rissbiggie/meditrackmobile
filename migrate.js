import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://postgres:12345678@localhost:5432/meditrack"
});

async function migrate() {
  try {
    const client = await pool.connect();
    console.log('Running migration...');
    
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
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 