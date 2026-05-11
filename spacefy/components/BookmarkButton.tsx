'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Plus, Check, Loader2 } from 'lucide-react';
import { getUserPlaylists, addToPlaylist, createPlaylist } from '@/app/actions/chords';
import { Input } from '@/components/ui/input';

interface BookmarkButtonProps {
  chordsheetId: string;
  userId?: string | null;
}

export function BookmarkButton({ chordsheetId, userId }: BookmarkButtonProps) {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) {
      getUserPlaylists(userId).then(setPlaylists);
    }
  }, [open, userId]);

  const handleAdd = async (playlistId: string) => {
    setLoading(true);
    await addToPlaylist(playlistId, chordsheetId);
    setAdded(playlistId);
    setLoading(false);
    setTimeout(() => { setOpen(false); setAdded(null); }, 800);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !userId) return;
    setCreating(true);
    const pl = await createPlaylist(userId, newName.trim());
    await addToPlaylist(pl.id, chordsheetId);
    setPlaylists(prev => [...prev, pl]);
    setNewName('');
    setAdded(pl.id);
    setCreating(false);
    setTimeout(() => { setOpen(false); setAdded(null); }, 800);
  };

  return (
    <div className="flex flex-col items-center relative">
      <Button
        size="icon"
        variant="ghost"
        id={`bookmark-btn-${chordsheetId}`}
        aria-label="Salvar em playlist"
        className="rounded-full w-12 h-12 bg-black/40 hover:bg-black/60 text-white"
        onClick={() => {
          if (!userId) { window.location.href = '/login'; return; }
          setOpen(o => !o);
        }}
      >
        <Bookmark className="w-7 h-7" />
      </Button>
      <span className="text-xs font-semibold mt-1 text-white">Salvar</span>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 right-0 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-4 w-64 space-y-3">
            <p className="text-sm font-semibold text-white">Salvar em...</p>

            {playlists.length === 0 && (
              <p className="text-xs text-zinc-500">Nenhuma playlist ainda.</p>
            )}

            {playlists.map(pl => (
              <Button
                key={pl.id}
                variant="ghost"
                size="sm"
                disabled={loading}
                className="w-full justify-between text-zinc-300 hover:text-white hover:bg-zinc-800"
                onClick={() => handleAdd(pl.id)}
              >
                {pl.name}
                {added === pl.id ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4 opacity-50" />}
              </Button>
            ))}

            <div className="flex gap-2 pt-1 border-t border-zinc-800">
              <Input
                placeholder="Nova playlist..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="h-8 text-sm bg-zinc-800 border-zinc-700 text-white"
              />
              <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleCreate} disabled={creating || !newName.trim()}>
                {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
