CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rank VARCHAR(50) NOT NULL,
  rank_color VARCHAR(50) NOT NULL DEFAULT 'text-gray-400',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO members (name, rank, rank_color) VALUES
  ('Armando Ross', 'Основатель', 'text-orange-400'),
  ('Carlos Ross', 'Заместитель', 'text-orange-300'),
  ('Miguel Ross', 'Капитан', 'text-gray-300'),
  ('Diego Ross', 'Капитан', 'text-gray-300'),
  ('Juan Ross', 'Солдат', 'text-gray-400'),
  ('Pedro Ross', 'Солдат', 'text-gray-400');
