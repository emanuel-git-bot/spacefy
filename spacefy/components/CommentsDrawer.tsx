'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { getComments, addComment } from '@/app/actions/chords';

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorUsername: string;
  authorAvatar: string | null;
}

interface CommentsDrawerProps {
  chordsheetId: string;
  currentUserId?: string | null;
  currentUsername?: string | null;
}

export function CommentsDrawer({ chordsheetId, currentUserId, currentUsername }: CommentsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const result = await getComments(chordsheetId);
    setComments(result as Comment[]);
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [open]);

  const handlePost = async () => {
    if (!newComment.trim() || !currentUserId) return;
    setPosting(true);
    await addComment(chordsheetId, currentUserId, newComment.trim());
    setNewComment('');
    await fetchComments();
    setPosting(false);
  };

  const timeAgo = (isoDate: string) => {
    const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex flex-col items-center">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full w-12 h-12 bg-black/40 hover:bg-black/60 text-white relative"
          onClick={() => setOpen(true)}
          id="comments-trigger"
          aria-label="Abrir comentários"
        >
          <MessageSquare className="w-7 h-7" />
        </Button>
        <span className="text-xs font-semibold mt-1 text-white">{comments.length}</span>
      </div>

      {/* Drawer / Panel */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-2xl md:rounded-2xl max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="font-bold text-lg text-white">Comentários</h2>
              <Button size="icon" variant="ghost" className="rounded-full text-zinc-400 hover:text-white" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Comments List */}
            <ScrollArea className="flex-1 px-4 py-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-zinc-500" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-zinc-500 py-8 text-sm">Seja o primeiro a comentar!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={c.authorAvatar || ''} />
                        <AvatarFallback>{c.authorUsername[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-zinc-800/50 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary">@{c.authorUsername}</span>
                          <span className="text-xs text-zinc-500">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-zinc-200">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              {currentUserId ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePost()}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    id="comment-input"
                  />
                  <Button onClick={handlePost} disabled={posting || !newComment.trim()} size="icon" className="shrink-0">
                    {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              ) : (
                <p className="text-center text-zinc-500 text-sm">
                  <a href="/login" className="text-primary hover:underline">Entre</a> para comentar
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
