'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Save, Plus } from 'lucide-react';

import { saveChordsheet } from '@/app/actions/chords';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

export default function EditorView() {
  const router = useRouter();
  const { user: sessionUser, loading: sessionLoading } = useSession();
  const [trackTitle, setTrackTitle] = useState("Minha Cifra");
  const [artist, setArtist] = useState("Artista Desconhecido");
  const [lyrics, setLyrics] = useState("Walking through the digital rain\nLost in the mainframe again");
  const [audioUrl, setAudioUrl] = useState("");
  const [sourceType, setSourceType] = useState<'local_audio'|'youtube'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [activeChordInput, setActiveChordInput] = useState<{line: number, word: number} | null>(null);
  const [chordValue, setChordValue] = useState("");
  
  // mock state for saved chords: lineIndex -> wordIndex -> chord
  const [chords, setChords] = useState<Record<number, Record<number, string>>>({});

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const lines = lyrics.split('\n');

  const saveChord = (lIdx: number, wIdx: number) => {
    if (chordValue) {
      setChords(prev => ({
        ...prev,
        [lIdx]: { ...(prev[lIdx] || {}), [wIdx]: chordValue }
      }));
    }
    setActiveChordInput(null);
    setChordValue("");
  };

  const handleSave = async () => {
    const formattedLines = lines.map((text, lIdx) => {
      const words = text.split(' ').filter(w => w.trim() !== '');
      const lineChords = [];
      for (let wIdx = 0; wIdx < words.length; wIdx++) {
        if (chords[lIdx] && chords[lIdx][wIdx]) {
          lineChords.push({
            time: 0, // Mock time for now in Editor
            chord: chords[lIdx][wIdx],
            wordIndex: wIdx
          });
        }
      }
      return {
        id: `l${lIdx}`,
        text,
        startTime: lIdx * 3, // Mock start time
        chords: lineChords
      };
    });

    if (!sessionUser) {
      router.push('/login');
      return;
    }

    const payload = {
      trackTitle,
      artist,
      audioUrl: audioUrl || 'JGwWNGJdvx8', // fallback
      sourceType,
      lines: formattedLines,
      authorId: sessionUser.id,
    };

    const res = await saveChordsheet(payload);
    if (res.success) {
      alert('Cifra salva com sucesso!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar Setup */}
      <div className="w-full md:w-80 border-r border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Studio Editor</h2>
          <p className="text-sm text-zinc-400">Sincronize sua cifra</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título da Música</Label>
            <Input 
              value={trackTitle} 
              onChange={(e) => setTrackTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Artista</Label>
            <Input 
              value={artist} 
              onChange={(e) => setArtist(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>URL do Áudio (YouTube ou MP3)</Label>
            <Input 
              placeholder="https://..." 
              value={audioUrl} 
              onChange={(e) => {
                setAudioUrl(e.target.value);
                setSourceType(e.target.value.includes('youtube') || e.target.value.length === 11 ? 'youtube' : 'local_audio');
              }}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <Label>Letra Original</Label>
          <Textarea 
            className="flex-1 min-h-[200px] bg-zinc-800 border-zinc-700 resize-none font-mono text-sm" 
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="w-4 h-4" />
          Salvar Projeto
        </Button>
      </div>

      {/* Main Timeline Editor */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-12 bg-zinc-950">
          <div className="max-w-3xl mx-auto space-y-12">
            {lines.map((line, lIdx) => {
              const words = line.split(' ').filter(w => w.trim() !== '');
              return (
                <div key={lIdx} className="flex flex-wrap gap-x-2 gap-y-10 group">
                  {words.map((word, wIdx) => {
                    const savedChord = chords[lIdx]?.[wIdx];
                    const isEditing = activeChordInput?.line === lIdx && activeChordInput?.word === wIdx;

                    return (
                      <div key={wIdx} className="relative flex flex-col items-center">
                        {/* Area do acorde */}
                        <div className="absolute -top-8 w-16 flex justify-center">
                          {isEditing ? (
                            <Input 
                              autoFocus
                              value={chordValue}
                              onChange={(e) => setChordValue(e.target.value)}
                              onBlur={() => saveChord(lIdx, wIdx)}
                              onKeyDown={(e) => e.key === 'Enter' && saveChord(lIdx, wIdx)}
                              className="h-7 w-14 px-1 text-center font-bold text-primary bg-zinc-800 border-primary"
                            />
                          ) : savedChord ? (
                            <div 
                              className="font-bold text-primary cursor-pointer hover:text-white transition-colors"
                              onClick={() => {
                                setChordValue(savedChord);
                                setActiveChordInput({line: lIdx, word: wIdx});
                              }}
                            >
                              {savedChord}
                            </div>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-primary transition-all cursor-pointer"
                              onClick={() => {
                                setChordValue("");
                                setActiveChordInput({line: lIdx, word: wIdx});
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Palavra cantada */}
                        <span className="text-xl font-medium text-zinc-300 hover:text-white transition-colors cursor-text">
                          {word}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Mini Player Timeline */}
        <div className="h-24 bg-zinc-900 border-t border-zinc-800 p-4 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="fill-white w-5 h-5" /> : <Play className="fill-white w-5 h-5 ml-1" />}
          </Button>
          
          <div className="flex-1 bg-zinc-800 h-16 rounded-lg relative overflow-hidden flex items-center px-4">
             {audioUrl ? (
               <>
                  <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3"></div>
                  </div>
                  <span className="absolute text-xs text-zinc-500 font-mono bottom-2 right-4">TIMELINE VIEW (MOCK)</span>
               </>
             ) : (
               <span className="text-zinc-500 text-sm">Insira a URL do áudio para ver a timeline...</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
