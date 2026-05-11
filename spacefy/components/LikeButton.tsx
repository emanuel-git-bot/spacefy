'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toggleLike, isLikedByUser, getLikeCount } from '@/app/actions/chords';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  chordsheetId: string;
  userId?: string | null;
  initialCount?: number;
  className?: string;
}

export function LikeButton({ chordsheetId, userId, initialCount = 0, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      isLikedByUser(chordsheetId, userId).then(setLiked);
    }
    getLikeCount(chordsheetId).then(setCount);
  }, [chordsheetId, userId]);

  const handleToggle = async () => {
    if (!userId || loading) return;
    setLoading(true);
    const res = await toggleLike(chordsheetId, userId);
    setLiked(res.liked);
    setCount(prev => res.liked ? prev + 1 : Math.max(0, prev - 1));
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleToggle}
        disabled={loading}
        id={`like-btn-${chordsheetId}`}
        aria-label={liked ? 'Remover like' : 'Dar like'}
        className={cn(
          "rounded-full w-12 h-12 bg-black/40 hover:bg-black/60 text-white transition-all",
          liked && "text-red-500"
        )}
      >
        <Heart className={cn("w-7 h-7 transition-all", liked && "fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]")} />
      </Button>
      <span className="text-xs font-semibold mt-1 text-white">{count}</span>
    </div>
  );
}
