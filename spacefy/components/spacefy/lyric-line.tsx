"use client";

import { cn } from "@/lib/utils";
import type { LyricLine as LyricLineType } from "@/lib/types";

type Props = {
  line: LyricLineType;
  isActive: boolean;
  isPast: boolean;
};

export function LyricLine({ line, isActive, isPast }: Props) {
  const words = line.text.split(" ");

  return (
    <div
      className={cn(
        "py-3 transition-all duration-500 ease-out",
        isActive && "scale-105",
        isPast && "opacity-40",
        !isActive && !isPast && "opacity-60"
      )}
    >
      <div className="flex flex-wrap items-end gap-x-2 gap-y-1 justify-center">
        {words.map((word, wordIndex) => {
          const chord = line.chords.find((c) => c.wordIndex === wordIndex);
          return (
            <div key={wordIndex} className="relative flex flex-col items-center">
              {chord && (
                <span
                  className={cn(
                    "text-sm font-bold mb-1 transition-all duration-300",
                    isActive
                      ? "text-primary animate-pulse"
                      : "text-primary/60"
                  )}
                >
                  {chord.chord}
                </span>
              )}
              <span
                className={cn(
                  "transition-all duration-500",
                  isActive
                    ? "text-foreground text-xl md:text-2xl font-semibold"
                    : "text-muted-foreground text-lg md:text-xl"
                )}
              >
                {word}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
