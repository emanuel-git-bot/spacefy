export type ChordSync = {
  time: number;
  chord: string;
  wordIndex: number;
};

export type LyricLine = {
  id: string;
  text: string;
  startTime: number;
  chords: ChordSync[];
};

export type Track = {
  title: string;
  artist: string;
  cover_url: string;
  duration: number;
  lyrics: LyricLine[];
};
