import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface AudioPlayerProps {
  sourceType: 'local_audio' | 'youtube';
  audioUrl: string; // url for local, videoId for youtube
  onPlay?: () => void;
  onPause?: () => void;
  onReady?: () => void;
  volume?: number; // 0 a 100
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ sourceType, audioUrl, onPlay, onPause, onReady, volume = 100 }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const ytPlayerRef = useRef<any>(null);
    const [isYtReady, setIsYtReady] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (sourceType === 'local_audio' && audioRef.current) {
          audioRef.current.play();
        } else if (sourceType === 'youtube' && isYtReady && ytPlayerRef.current) {
          ytPlayerRef.current.playVideo();
        }
      },
      pause: () => {
        if (sourceType === 'local_audio' && audioRef.current) {
          audioRef.current.pause();
        } else if (sourceType === 'youtube' && isYtReady && ytPlayerRef.current) {
          ytPlayerRef.current.pauseVideo();
        }
      },
      seekTo: (time: number) => {
        if (sourceType === 'local_audio' && audioRef.current) {
          audioRef.current.currentTime = time;
        } else if (sourceType === 'youtube' && isYtReady && ytPlayerRef.current) {
          ytPlayerRef.current.seekTo(time, true);
        }
      },
      getCurrentTime: () => {
        if (sourceType === 'local_audio' && audioRef.current) {
          return audioRef.current.currentTime;
        } else if (sourceType === 'youtube' && isYtReady && ytPlayerRef.current) {
          return ytPlayerRef.current.getCurrentTime() || 0;
        }
        return 0;
      },
      getDuration: () => {
        if (sourceType === 'local_audio' && audioRef.current) {
          return audioRef.current.duration;
        } else if (sourceType === 'youtube' && isYtReady && ytPlayerRef.current) {
          return ytPlayerRef.current.getDuration() || 0;
        }
        return 0;
      }
    }));

    const onYtReady: YouTubeProps['onReady'] = (event) => {
      ytPlayerRef.current = event.target;
      event.target.setVolume(volume);
      setIsYtReady(true);
      if (onReady) onReady();
    };

    const onYtStateChange: YouTubeProps['onStateChange'] = (event) => {
      // 1 = playing, 2 = paused
      if (event.data === 1 && onPlay) onPlay();
      if (event.data === 2 && onPause) onPause();
    };

    return (
      <div className="audio-player-container hidden">
        {sourceType === 'local_audio' ? (
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={onPlay}
            onPause={onPause}
            onCanPlay={onReady}
          />
        ) : (
          <YouTube
            videoId={audioUrl}
            opts={{
              height: '0',
              width: '0',
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                playsinline: 1,
              },
            }}
            onReady={onYtReady}
            onStateChange={onYtStateChange}
          />
        )}
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';
