'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';

interface ShareButtonProps {
  chordsheetId: string;
  trackTitle: string;
  artist: string;
  className?: string;
}

export function ShareButton({ chordsheetId, trackTitle, artist, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/player/${chordsheetId}`
    : `/player/${chordsheetId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trackTitle} - ${artist} | Spacefy`,
          text: `Veja a cifra sincronizada de "${trackTitle}" por ${artist} no Spacefy!`,
          url: shareUrl,
        });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <Button
        size="icon"
        variant="ghost"
        id={`share-btn-${chordsheetId}`}
        aria-label="Compartilhar cifra"
        className="rounded-full w-12 h-12 bg-black/40 hover:bg-black/60 text-white"
        onClick={() => setOpen(o => !o)}
      >
        <Share2 className="w-7 h-7" />
      </Button>
      <span className="text-xs font-semibold mt-1 text-white">Share</span>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 right-0 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-3 w-64 space-y-2">
            <p className="text-xs text-zinc-400 px-1 truncate">🔗 {shareUrl}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link copiado!' : 'Copiar link'}
            </Button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                onClick={handleNativeShare}
              >
                <ExternalLink className="w-4 h-4" />
                Compartilhar...
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
