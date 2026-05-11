"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Track, LyricLine, ChordSync } from "./types";
import { mockTrack } from "./mock-data";

type PlayerContextType = {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentLineIndex: number;
  lyrics: LyricLine[];
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  addChord: (lineId: string, chord: ChordSync) => void;
  removeChord: (lineId: string, chordIndex: number) => void;
  updateLyrics: (lyrics: LyricLine[]) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track] = useState<Track>(mockTrack);
  const [lyrics, setLyrics] = useState<LyricLine[]>(mockTrack.lyrics);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const duration = track.duration;

  const currentLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.startTime && (!nextLine || currentTime < nextLine.startTime);
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((prev) => !prev), []);
  const seek = useCallback((time: number) => setCurrentTime(Math.max(0, Math.min(time, duration))), [duration]);
  const skipForward = useCallback(() => setCurrentTime((prev) => Math.min(prev + 10, duration)), [duration]);
  const skipBackward = useCallback(() => setCurrentTime((prev) => Math.max(prev - 10, 0)), []);

  const addChord = useCallback((lineId: string, chord: ChordSync) => {
    setLyrics((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? { ...line, chords: [...line.chords, chord].sort((a, b) => a.wordIndex - b.wordIndex) }
          : line
      )
    );
  }, []);

  const removeChord = useCallback((lineId: string, chordIndex: number) => {
    setLyrics((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? { ...line, chords: line.chords.filter((_, i) => i !== chordIndex) }
          : line
      )
    );
  }, []);

  const updateLyrics = useCallback((newLyrics: LyricLine[]) => {
    setLyrics(newLyrics);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        currentTime,
        duration,
        currentLineIndex,
        lyrics,
        play,
        pause,
        toggle,
        seek,
        skipForward,
        skipBackward,
        addChord,
        removeChord,
        updateLyrics,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
