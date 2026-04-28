CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  vk_id BIGINT UNIQUE NOT NULL,
  vk_name VARCHAR(200),
  vk_photo VARCHAR(500),
  member_id INTEGER REFERENCES members(id),
  session_token VARCHAR(128) UNIQUE,
  session_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE warnings (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id),
  reason TEXT NOT NULL,
  issued_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
