import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  followersCount: integer('followers_count').default(0),
  followingCount: integer('following_count').default(0),
  settings: text('settings', { mode: 'json' }).$type<{
    theme: 'dark' | 'light' | 'system';
    neonColor: string;
    fontSize: 'small' | 'medium' | 'large';
    notationSystem: 'american' | 'latin';
    showChordDiagrams: boolean;
    countInSeconds: number;
    scrollSpeedMultiplier: number;
    isProfilePrivate: boolean;
  }>(),
});

export const tracks = sqliteTable('tracks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  coverUrl: text('cover_url'),
  sourceType: text('source_type').$type<'local_audio' | 'youtube'>().notNull(),
  audioUrl: text('audio_url').notNull(),
  views: integer('views').default(0),
  score: real('score').default(0),
});

export const chordsheets = sqliteTable('chordsheets', {
  id: text('id').primaryKey(),
  trackId: text('track_id').notNull().references(() => tracks.id),
  authorId: text('author_id').notNull().references(() => users.id),
  lines: text('lines', { mode: 'json' }).$type<Array<{
    id: string;
    text: string;
    startTime: number;
    chords: Array<{
      time: number;
      chord: string;
      wordIndex: number;
    }>;
  }>>(),
});

// Tabela de Comentários
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  chordsheetId: text('chordsheet_id').notNull().references(() => chordsheets.id),
  authorId: text('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: text('created_at').notNull(),
});

// Tabela de Favoritos (Likes)
export const likes = sqliteTable('likes', {
  id: text('id').primaryKey(),
  chordsheetId: text('chordsheet_id').notNull().references(() => chordsheets.id),
  userId: text('user_id').notNull().references(() => users.id),
});

// Tabela de Playlists (Favoritos/Bookmark)
export const playlists = sqliteTable('playlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
});

// Relação Playlist <-> Chordsheet
export const playlistItems = sqliteTable('playlist_items', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull().references(() => playlists.id),
  chordsheetId: text('chordsheet_id').notNull().references(() => chordsheets.id),
});

// Tabela de Follows
export const follows = sqliteTable('follows', {
  id: text('id').primaryKey(),
  followerId: text('follower_id').notNull().references(() => users.id),
  followingId: text('following_id').notNull().references(() => users.id),
});
