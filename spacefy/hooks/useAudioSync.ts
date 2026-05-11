import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para sincronização de alta precisão do tempo atual de um player de áudio/vídeo.
 * Utiliza `requestAnimationFrame` para garantir ~60 FPS (16ms) de precisão,
 * evitando a latência do evento `timeupdate` padrão do HTML5.
 */
export function useAudioSync(getCurrentTime: () => number, isPlaying: boolean) {
  const [currentTime, setCurrentTime] = useState(0);
  const requestRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    setCurrentTime(getCurrentTime());
    requestRef.current = requestAnimationFrame(updateTime);
  }, [getCurrentTime]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateTime);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      // Garante que pega o tempo final quando pausa
      setCurrentTime(getCurrentTime());
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, updateTime, getCurrentTime]);

  return currentTime;
}
