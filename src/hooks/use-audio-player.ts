
import { useState, useRef, useEffect } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = (id: string, url: string) => {
    if (!url) return;

    if (currentAudioId === id && isPlaying) {
      // If the same song is clicked, pause it
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
    } else {
      // If a different song is clicked, stop the current one and play the new one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.5;
      
      // Set up ended event to reset the playing state
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentAudioId(null);
      };
      
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setCurrentAudioId(null);
      });
      
      setIsPlaying(true);
      setCurrentAudioId(id);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
    }
  };

  return {
    isPlaying,
    currentAudioId,
    playAudio,
    stopAudio
  };
};

export default useAudioPlayer;
