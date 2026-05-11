"use client";

import { useState } from "react";
import { usePlayer } from "@/lib/player-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  X,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChordSync } from "@/lib/types";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function EditorView() {
  const {
    track,
    lyrics,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    skipBackward,
    skipForward,
    addChord,
    removeChord,
  } = usePlayer();

  const [selectedWord, setSelectedWord] = useState<{
    lineId: string;
    wordIndex: number;
    word: string;
  } | null>(null);
  const [chordInput, setChordInput] = useState("");

  const handleAddChord = () => {
    if (selectedWord && chordInput.trim()) {
      const newChord: ChordSync = {
        time: currentTime,
        chord: chordInput.trim(),
        wordIndex: selectedWord.wordIndex,
      };
      addChord(selectedWord.lineId, newChord);
      setChordInput("");
      setSelectedWord(null);
    }
  };

  const allChords = lyrics.flatMap((line) =>
    line.chords.map((chord) => ({
      ...chord,
      lineId: line.id,
      lineText: line.text,
    }))
  ).sort((a, b) => a.time - b.time);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 backdrop-blur-xl bg-card/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{track.title}</h1>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>
        </div>

        {/* Lyrics editor */}
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Editor de Cifras
              </h2>
              <p className="text-sm text-muted-foreground">
                Clique em uma palavra para adicionar um acorde sincronizado
              </p>
            </div>

            {lyrics.map((line) => {
              const words = line.text.split(" ");
              return (
                <div key={line.id} className="p-4 rounded-xl bg-card/50 border border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {words.map((word, wordIndex) => {
                      const existingChord = line.chords.find(
                        (c) => c.wordIndex === wordIndex
                      );
                      return (
                        <Popover
                          key={wordIndex}
                          open={
                            selectedWord?.lineId === line.id &&
                            selectedWord?.wordIndex === wordIndex
                          }
                          onOpenChange={(open) => {
                            if (open) {
                              setSelectedWord({ lineId: line.id, wordIndex, word });
                            } else {
                              setSelectedWord(null);
                              setChordInput("");
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <button
                              className={cn(
                                "relative px-2 py-1 rounded-md transition-all duration-200",
                                "hover:bg-primary/20 hover:text-primary",
                                existingChord && "bg-primary/10"
                              )}
                            >
                              {existingChord && (
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                                  {existingChord.chord}
                                </span>
                              )}
                              <span className="text-foreground">{word}</span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-4" align="center">
                            <div className="space-y-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  Palavra selecionada
                                </p>
                                <p className="font-bold text-foreground">{word}</p>
                              </div>

                              {existingChord ? (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                    <span className="font-mono font-bold text-primary">
                                      {existingChord.chord}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(existingChord.time)}
                                    </span>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      const chordIdx = line.chords.findIndex(
                                        (c) => c.wordIndex === wordIndex
                                      );
                                      if (chordIdx !== -1) {
                                        removeChord(line.id, chordIdx);
                                        setSelectedWord(null);
                                      }
                                    }}
                                  >
                                    Remover Acorde
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <Input
                                    placeholder="Ex: Am, G, Cmaj7..."
                                    value={chordInput}
                                    onChange={(e) => setChordInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddChord();
                                      }
                                    }}
                                    className="font-mono"
                                  />
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Timestamp: {formatTime(currentTime)}</span>
                                  </div>
                                  <Button
                                    onClick={handleAddChord}
                                    disabled={!chordInput.trim()}
                                    className="w-full"
                                  >
                                    Adicionar Acorde
                                  </Button>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Mini player */}
        <div className="p-4 border-t border-border/50 backdrop-blur-xl bg-card/50">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={([value]) => seek(value)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" onClick={skipBackward}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggle}
                size="icon"
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Timeline of chords */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/50 backdrop-blur-xl bg-card/30">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            Acordes Sincronizados
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {allChords.length} acordes na timeline
          </p>
        </div>

        <ScrollArea className="h-64 lg:h-[calc(100vh-120px)]">
          <div className="p-4 space-y-2">
            {allChords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum acorde adicionado ainda
              </p>
            ) : (
              allChords.map((chord, index) => (
                <div
                  key={`${chord.lineId}-${chord.wordIndex}-${index}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    currentTime >= chord.time && currentTime < chord.time + 3
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground w-12">
                    {formatTime(chord.time)}
                  </span>
                  <span className="font-bold text-primary flex-1">
                    {chord.chord}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const line = lyrics.find((l) => l.id === chord.lineId);
                      if (line) {
                        const chordIdx = line.chords.findIndex(
                          (c) => c.wordIndex === chord.wordIndex
                        );
                        if (chordIdx !== -1) {
                          removeChord(chord.lineId, chordIdx);
                        }
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
