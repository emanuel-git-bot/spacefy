"use client";

import { usePlayer } from "@/lib/player-context";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function MediaControls() {
  const { isPlaying, currentTime, duration, toggle, seek, skipBackward, skipForward } =
    usePlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-card/80 border-t border-border/50 px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12 text-right font-mono">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={([value]) => seek(value)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 font-mono">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              onClick={toggle}
              size="icon"
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
