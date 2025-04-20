-- Add email verification and password reset columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_expiry TIMESTAMP,
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_expiry TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP; 