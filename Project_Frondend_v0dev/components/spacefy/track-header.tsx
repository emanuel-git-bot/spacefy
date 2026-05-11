"use client";

import { usePlayer } from "@/lib/player-context";
import Image from "next/image";

export function TrackHeader() {
  const { track } = usePlayer();

  return (
    <div className="relative">
      {/* Blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={track.cover_url}
          alt=""
          fill
          className="object-cover blur-3xl scale-110 opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          {/* Album cover */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Image
              src={track.cover_url}
              alt={track.title}
              width={120}
              height={120}
              className="relative rounded-lg shadow-2xl shadow-black/50 object-cover"
              priority
            />
          </div>

          {/* Track info */}
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate text-balance">
              {track.title}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {track.artist}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
