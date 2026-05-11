'use client';

import { useState, useEffect } from 'react';
import { getSession } from '@/app/actions/auth';

interface SessionUser {
  id: string;
  username: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  followersCount?: number | null;
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(session => {
      setUser(session as SessionUser | null);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
