-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample user (password: 123456789)
INSERT INTO users (name, email, password) VALUES (
  'Admin User',
  'admin@cltech.com',
  '$2a$10$KIX4Xv5q/g5Bw5m6y7z8k8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4'
) ON CONFLICT DO NOTHING;
