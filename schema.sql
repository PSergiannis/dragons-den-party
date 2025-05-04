-- Drop tables if they exist (in order to avoid foreign key issues)
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS cocktails;
DROP TABLE IF EXISTS dragons;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cocktails table
CREATE TABLE cocktails (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dragon_name TEXT NOT NULL,
  ingredients TEXT NOT NULL
);

-- Dragons table
CREATE TABLE dragons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Votes table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('cocktail', 'dragon')),
  option_id INTEGER NOT NULL,
  priority INTEGER NOT NULL CHECK (priority IN (1,2,3)),
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, vote_type, priority)
);


INSERT INTO dragons (name) VALUES
  ('Γιάννης Τσιώρης'),
  ('Λέων Γιοχάη'),
  ('Τάσος Οικονόμου'),
  ('Νίκη Γουλιμή'),
  ('Χάρης Βαφειάς'),
  ('Μαρία Χατζηστεφανή'),
  ('Λιλή Περγαντά');

-- Insert cocktail data (note: single quotes in names are escaped with two single quotes)
INSERT INTO cocktails (name, dragon_name, ingredients) VALUES
  ('TsioRISK-It',      'Γιάννης Τσιώρης',        'Whiskey, lime juice, ginger beer'),
  ('GioHi Bye',        'Λέων Γιοχάη',            'Dark rum, cola, lime juice'),
  ('Oikonomojito',     'Τάσος Οικονόμου',        'Gin, tonic water, lemon juice'),
  ('Niki''s Credit',    'Νίκη Γουλιμή',           'Tequila, orange juice, grenadine'),
  ('Shippowner''s Aura','Χάρης Βαφειάς',         'Ouzo, vodka, lemon, blue curaçao, soda'),
  ('Maria Glow Mule',  'Μαρία Χατζηστεφανή',     'White rum, coconut cream, pineapple juice'),
  ('Lili Spritz',      'Λιλή Περγαντά',          'Aperol Spritz with granny''s special');