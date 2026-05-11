'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AudioPlayer, AudioPlayerRef } from '@/components/AudioPlayer';
import { useAudioSync } from '@/hooks/useAudioSync';
import { transposeChord } from '@/lib/chords';
import { Button } from '@/components/ui/button';
import { Play, Pause, FastForward, Rewind, ArrowLeft, Settings2, Printer } from 'lucide-react';
import Link from 'next/link';
import { getChordsheet } from '@/app/actions/chords';
import { LikeButton } from '@/components/LikeButton';
import { CommentsDrawer } from '@/components/CommentsDrawer';
import { ShareButton } from '@/components/ShareButton';
import { BookmarkButton } from '@/components/BookmarkButton';
import { useSession } from '@/hooks/useSession';

export default function PlayerView() {
  const params = useParams();
  const id = params.id as string;
  const playerRef = useRef<AudioPlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [data, setData] = useState<any>(null);
  const { user: sessionUser } = useSession();

  useEffect(() => {
    if (id) {
      getChordsheet(id).then(res => {
        if (res) setData(res);
      });
    }
  }, [id]);

  // O hook de sync garante que re-renderiza rápido
  const currentTime = useAudioSync(() => playerRef.current?.getCurrentTime() || 0, isPlaying);

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause();
      setIsPlaying(false);
    } else {
      playerRef.current?.play();
      setIsPlaying(true);
    }
  };

  const activeLineIndex = useMemo(() => {
    let active = -1;
    if (!data?.chordsheet?.lines) return active;
    for (let i = 0; i < data.chordsheet.lines.length; i++) {
      if (currentTime >= data.chordsheet.lines[i].startTime - 0.5) { // pre-ativa levemente
        active = i;
      }
    }
    return active;
  }, [currentTime, data]);

  if (!data) {
    return <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">Carregando cifra...</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-white overflow-hidden relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between p-4 z-50 bg-gradient-to-b from-black to-transparent">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-lg">{data.track.title}</h1>
          <p className="text-sm text-zinc-400">{data.track.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 rounded-full border border-zinc-800">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-l-full px-3 text-zinc-400 hover:text-white"
              onClick={() => setTransposeSteps(s => s - 1)}
            >
              -1
            </Button>
            <span className="text-xs font-bold w-6 text-center text-primary">
              {transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-r-full px-3 text-zinc-400 hover:text-white"
              onClick={() => setTransposeSteps(s => s + 1)}
            >
              +1
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <AudioPlayer
        ref={playerRef}
        sourceType={data.track.sourceType}
        audioUrl={data.track.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Lyrics Autoscroll Container */}
      <main className="flex-1 overflow-y-auto px-6 py-32 flex flex-col gap-12 items-center" style={{ scrollBehavior: 'smooth' }}>
        {data.chordsheet.lines.map((line: any, lineIndex: number) => {
          const isActiveLine = lineIndex === activeLineIndex;
          const words = line.text.split(' ');

          return (
            <div 
              key={line.id} 
              className={`flex flex-wrap justify-center text-center gap-x-3 gap-y-8 transition-all duration-500 ${
                isActiveLine ? 'scale-110 opacity-100' : 'scale-95 opacity-40'
              }`}
            >
              {words.map((word, wordIndex) => {
                // Procura se há um acorde atrelado a esta palavra exata
                const chordData = line.chords.find(c => c.wordIndex === wordIndex);
                const isActiveChord = chordData && currentTime >= chordData.time;

                return (
                  <div key={wordIndex} className="relative flex flex-col items-center">
                    {chordData && (
                      <span className={`absolute -top-8 font-black text-2xl transition-all duration-150 ${
                        isActiveChord ? 'text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.8)] scale-110' : 'text-zinc-500'
                      }`}>
                        {transposeChord(chordData.chord, transposeSteps)}
                      </span>
                    )}
                    <span className={`text-2xl font-bold transition-colors duration-300 ${isActiveChord ? 'text-white' : 'text-zinc-300'}`}>
                      {word}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>

      {/* Right Social Actions Sidebar */}
      <div className="absolute right-4 bottom-36 z-40 flex flex-col items-center gap-5">
        <LikeButton chordsheetId={id} userId={sessionUser?.id || null} />
        <CommentsDrawer chordsheetId={id} currentUserId={sessionUser?.id || null} currentUsername={sessionUser?.username || null} />
        <BookmarkButton chordsheetId={id} userId={sessionUser?.id || null} />
        <ShareButton chordsheetId={id} trackTitle={data?.track?.title || ''} artist={data?.track?.artist || ''} />
        <Link href={`/print/${id}`} target="_blank">
          <div className="flex flex-col items-center">
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-black/40 hover:bg-black/60 text-white">
              <Printer className="w-6 h-6" />
            </Button>
            <span className="text-xs font-semibold mt-1 text-white">Print</span>
          </div>
        </Link>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center pb-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full w-12 h-12" onClick={() => playerRef.current?.seekTo(currentTime - 5)}>
            <Rewind className="w-6 h-6 fill-current" />
          </Button>
          
          <Button 
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all hover:scale-105"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full w-12 h-12" onClick={() => playerRef.current?.seekTo(currentTime + 5)}>
            <FastForward className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
}
