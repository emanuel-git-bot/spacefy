"use client";

import { usePlayer } from "@/lib/player-context";
import { LyricLine } from "./lyric-line";
import { useEffect, useRef } from "react";

export function LyricsPanel() {
  const { lyrics, currentLineIndex } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (currentLineIndex >= 0 && lineRefs.current[currentLineIndex]) {
      lineRefs.current[currentLineIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLineIndex]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide"
    >
      <div className="max-w-2xl mx-auto space-y-2">
        {lyrics.map((line, index) => (
          <div
            key={line.id}
            ref={(el) => {
              lineRefs.current[index] = el;
            }}
          >
            <LyricLine
              line={line}
              isActive={index === currentLineIndex}
              isPast={index < currentLineIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
