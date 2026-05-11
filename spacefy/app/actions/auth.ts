'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function login(email: string, usernameHint?: string) {
  // Mock login: always successful if user exists, else creates it
  let userRows = await db.select().from(users).where(eq(users.email, email));
  let user = userRows[0];

  if (!user) {
    // Auto-register for prototype purposes
    const id = require('crypto').randomUUID();
    const username = usernameHint || email.split('@')[0];
    await db.insert(users).values({
      id,
      email,
      username,
    });
    user = { id, email, username, bio: null, avatarUrl: null, followersCount: 0, followingCount: 0, settings: null };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('spacefy_session', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, user };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('spacefy_session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('spacefy_session')?.value;
  if (!sessionId) return null;

  const userRows = await db.select().from(users).where(eq(users.id, sessionId));
  return userRows[0] || null;
}
