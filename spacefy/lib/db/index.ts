import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Para o ambiente de desenvolvimento local, usaremos um arquivo SQLite.
// No Cloudflare, isso será trocado pelo D1 (drizzle-orm/d1).
const sqlite = new Database(path.join(process.cwd(), 'sqlite.db'));

// Auto-migrate: garante que todas as tabelas existem com o schema atual.
// Isso evita erros de "no such column" quando o schema evolui.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    settings TEXT
  );

  CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_url TEXT,
    source_type TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    score REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS chordsheets (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL REFERENCES tracks(id),
    author_id TEXT NOT NULL REFERENCES users(id),
    lines TEXT
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    chordsheet_id TEXT NOT NULL REFERENCES chordsheets(id),
    author_id TEXT NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    chordsheet_id TEXT NOT NULL REFERENCES chordsheets(id),
    user_id TEXT NOT NULL REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    is_public INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS playlist_items (
    id TEXT PRIMARY KEY,
    playlist_id TEXT NOT NULL REFERENCES playlists(id),
    chordsheet_id TEXT NOT NULL REFERENCES chordsheets(id)
  );

  CREATE TABLE IF NOT EXISTS follows (
    id TEXT PRIMARY KEY,
    follower_id TEXT NOT NULL REFERENCES users(id),
    following_id TEXT NOT NULL REFERENCES users(id)
  );

  -- Adicionar colunas novas sem quebrar banco existente (ignora erro se já existir)
  -- SQLite não suporta IF NOT EXISTS para colunas, então usamos um try por coluna.
`);

// Tenta adicionar colunas novas de forma segura (ignora erros se já existirem)
const addColumnSafe = (sql: string) => {
  try { sqlite.exec(sql); } catch { /* coluna já existe */ }
};
addColumnSafe(`ALTER TABLE users ADD COLUMN avatar_url TEXT`);
addColumnSafe(`ALTER TABLE users ADD COLUMN following_count INTEGER DEFAULT 0`);

export const db = drizzle(sqlite, { schema });
