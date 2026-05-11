'use server';

import { db } from '@/lib/db';
import { users, tracks, chordsheets, comments, likes, follows, playlists, playlistItems } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Server Action para semear o banco com dados iniciais (se vazio)
export async function seedDatabase() {
  const existingUsers = await db.select().from(users);

  if (existingUsers.length === 0) {
    const authorId = randomUUID();
    const trackId1 = randomUUID();
    const trackId2 = randomUUID();
    const trackId3 = randomUUID();
    const csId1 = randomUUID();
    const csId2 = randomUUID();
    const csId3 = randomUUID();

    await db.insert(users).values({
      id: authorId,
      username: 'gui_chords',
      email: 'gui@spacefy.com',
      bio: 'Músico de fim de semana 🎸',
      avatarUrl: 'https://i.pravatar.cc/150?u=gui',
      followersCount: 1540,
    });

    await db.insert(tracks).values([
      {
        id: trackId1,
        title: 'Starboy (Acoustic)',
        artist: 'The Weeknd',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
        sourceType: 'local_audio',
        audioUrl: '/audio/placeholder.mp3',
        views: 12050,
        score: 95.5,
      },
      {
        id: trackId2,
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        coverUrl: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500&q=80',
        sourceType: 'youtube',
        audioUrl: 'JGwWNGJdvx8',
        views: 8400,
        score: 88.0,
      },
      {
        id: trackId3,
        title: 'Hotel California',
        artist: 'Eagles',
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80',
        sourceType: 'youtube',
        audioUrl: 'EqPtz5qN7HM',
        views: 45000,
        score: 150.2,
      }
    ]);

    await db.insert(chordsheets).values([
      {
        id: csId1,
        trackId: trackId1,
        authorId: authorId,
        lines: [
          {
            id: 'l1', text: "I'm a motherf***in' starboy", startTime: 2.0,
            chords: [{ time: 2.0, chord: 'Am', wordIndex: 0 }]
          }
        ]
      },
      {
        id: csId2,
        trackId: trackId2,
        authorId: authorId,
        lines: [
          {
            id: 'l1', text: "The club isn't the best place to find a lover", startTime: 1.0,
            chords: [{ time: 1.0, chord: 'C#m', wordIndex: 2 }]
          }
        ]
      },
      {
        id: csId3,
        trackId: trackId3,
        authorId: authorId,
        lines: [
          {
            id: 'l1', text: "On a dark desert highway, cool wind in my hair", startTime: 12.0,
            chords: [{ time: 12.0, chord: 'Bm', wordIndex: 2 }]
          }
        ]
      }
    ]);
  }
}

export async function getFeed() {
  await seedDatabase();

  const results = await db.select({
    chordsheetId: chordsheets.id,
    trackTitle: tracks.title,
    artist: tracks.artist,
    coverUrl: tracks.coverUrl,
    score: tracks.score,
    views: tracks.views,
    author: users.username,
    authorAvatar: users.avatarUrl,
    authorId: users.id,
  })
  .from(chordsheets)
  .innerJoin(tracks, eq(chordsheets.trackId, tracks.id))
  .innerJoin(users, eq(chordsheets.authorId, users.id))
  .orderBy(desc(tracks.score));

  return results;
}

export async function getChordsheet(id: string) {
  const result = await db.select({
    chordsheet: chordsheets,
    track: tracks,
    user: users,
  })
  .from(chordsheets)
  .innerJoin(tracks, eq(chordsheets.trackId, tracks.id))
  .innerJoin(users, eq(chordsheets.authorId, users.id))
  .where(eq(chordsheets.id, id))
  .limit(1);

  return result[0] || null;
}

export async function saveChordsheet(payload: {
  trackTitle: string;
  artist: string;
  audioUrl: string;
  sourceType: 'local_audio' | 'youtube';
  lines: any[];
  authorId: string;
}) {
  const trackId = randomUUID();
  const chordsheetId = randomUUID();

  await db.insert(tracks).values({
    id: trackId,
    title: payload.trackTitle,
    artist: payload.artist,
    audioUrl: payload.audioUrl,
    sourceType: payload.sourceType,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
    views: 0,
    score: 0,
  });

  await db.insert(chordsheets).values({
    id: chordsheetId,
    trackId: trackId,
    authorId: payload.authorId,
    lines: payload.lines,
  });

  return { success: true, chordsheetId };
}

// -------- COMENTÁRIOS --------

export async function getComments(chordsheetId: string) {
  const result = await db.select({
    id: comments.id,
    text: comments.text,
    createdAt: comments.createdAt,
    authorUsername: users.username,
    authorAvatar: users.avatarUrl,
  })
  .from(comments)
  .innerJoin(users, eq(comments.authorId, users.id))
  .where(eq(comments.chordsheetId, chordsheetId))
  .orderBy(desc(comments.createdAt));

  return result;
}

export async function addComment(chordsheetId: string, authorId: string, text: string) {
  const id = randomUUID();
  await db.insert(comments).values({
    id,
    chordsheetId,
    authorId,
    text,
    createdAt: new Date().toISOString(),
  });
  return { success: true, id };
}

// -------- LIKES --------

export async function getLikeCount(chordsheetId: string) {
  const result = await db.select().from(likes).where(eq(likes.chordsheetId, chordsheetId));
  return result.length;
}

export async function toggleLike(chordsheetId: string, userId: string) {
  const existing = await db.select().from(likes).where(
    and(eq(likes.chordsheetId, chordsheetId), eq(likes.userId, userId))
  );

  if (existing.length > 0) {
    await db.delete(likes).where(eq(likes.id, existing[0].id));
    return { liked: false };
  } else {
    await db.insert(likes).values({ id: randomUUID(), chordsheetId, userId });
    // Increment score on like
    const cs = await db.select({ trackId: chordsheets.trackId }).from(chordsheets).where(eq(chordsheets.id, chordsheetId)).limit(1);
    if (cs.length > 0) {
      const trackRow = await db.select({ score: tracks.score }).from(tracks).where(eq(tracks.id, cs[0].trackId)).limit(1);
      await db.update(tracks).set({ score: (trackRow[0]?.score || 0) + 5 }).where(eq(tracks.id, cs[0].trackId));
    }
    return { liked: true };
  }
}

export async function isLikedByUser(chordsheetId: string, userId: string) {
  const result = await db.select().from(likes).where(
    and(eq(likes.chordsheetId, chordsheetId), eq(likes.userId, userId))
  );
  return result.length > 0;
}

// -------- PLAYLISTS (FAVORITOS) --------

export async function getUserPlaylists(userId: string) {
  return db.select().from(playlists).where(eq(playlists.userId, userId));
}

export async function addToPlaylist(playlistId: string, chordsheetId: string) {
  const existing = await db.select().from(playlistItems).where(
    and(eq(playlistItems.playlistId, playlistId), eq(playlistItems.chordsheetId, chordsheetId))
  );
  if (existing.length > 0) return { success: false, message: 'Já está na playlist' };
  
  await db.insert(playlistItems).values({ id: randomUUID(), playlistId, chordsheetId });
  return { success: true };
}

export async function createPlaylist(userId: string, name: string, isPublic: boolean = true) {
  const id = randomUUID();
  await db.insert(playlists).values({ id, userId, name, isPublic });
  return { id, userId, name, isPublic };
}

// -------- FOLLOWS / PERFIL --------

export async function getUserProfile(username: string) {
  await seedDatabase();
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result[0] || null;
}

export async function getUserChordsheets(userId: string) {
  return db.select({
    chordsheetId: chordsheets.id,
    trackTitle: tracks.title,
    artist: tracks.artist,
    coverUrl: tracks.coverUrl,
    score: tracks.score,
    views: tracks.views,
  })
  .from(chordsheets)
  .innerJoin(tracks, eq(chordsheets.trackId, tracks.id))
  .where(eq(chordsheets.authorId, userId))
  .orderBy(desc(tracks.score));
}

export async function toggleFollow(followerId: string, followingId: string) {
  const existing = await db.select().from(follows).where(
    and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
  );
  if (existing.length > 0) {
    await db.delete(follows).where(eq(follows.id, existing[0].id));
    await db.update(users).set({ followersCount: Math.max(0, (await db.select({ fc: users.followersCount }).from(users).where(eq(users.id, followingId)).limit(1))[0]?.fc || 0) - 1 }).where(eq(users.id, followingId));
    return { following: false };
  } else {
    await db.insert(follows).values({ id: randomUUID(), followerId, followingId });
    const cur = (await db.select({ fc: users.followersCount }).from(users).where(eq(users.id, followingId)).limit(1))[0]?.fc || 0;
    await db.update(users).set({ followersCount: cur + 1 }).where(eq(users.id, followingId));
    return { following: true };
  }
}

export async function isFollowing(followerId: string, followingId: string) {
  const result = await db.select().from(follows).where(
    and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
  );
  return result.length > 0;
}
