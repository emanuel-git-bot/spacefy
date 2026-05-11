"use client";

import { TrackHeader } from "./track-header";
import { LyricsPanel } from "./lyrics-panel";
import { MediaControls } from "./media-controls";

export function PlayerView() {
  return (
    <div className="min-h-screen flex flex-col pb-32">
      <TrackHeader />
      <LyricsPanel />
      <MediaControls />
    </div>
  );
}
