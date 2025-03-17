
import { useState, useRef, useEffect } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
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
    if (!url) {
      console.log("No audio URL provided");
      return;
    }

    // For testing, use a known working audio sample if we're getting errors
    const fallbackUrl = "https://assets.coderrocketfuel.com/pomodoro-times-up.mp3";
    const audioUrl = url || fallbackUrl;

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
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = volume;
      
      // Set up ended event to reset the playing state
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentAudioId(null);
      };

      // Add error handling
      audioRef.current.onerror = (error) => {
        console.error("Audio playback error:", error);
        console.log("Attempted to play URL:", audioUrl);
        setIsPlaying(false);
        setCurrentAudioId(null);
        
        // Try fallback if original URL failed and it's not already the fallback
        if (audioUrl !== fallbackUrl) {
          console.log("Trying fallback audio URL");
          playAudio(id, fallbackUrl);
        }
      };
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentAudioId(id);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setCurrentAudioId(null);
        
        // Try fallback if original URL failed
        if (audioUrl !== fallbackUrl) {
          console.log("Trying fallback audio URL after play failure");
          playAudio(id, fallbackUrl);
        }
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
    }
  };

  const changeVolume = (newVolume: number) => {
    if (newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }
  };

  return {
    isPlaying,
    currentAudioId,
    volume,
    playAudio,
    stopAudio,
    changeVolume
  };
};

export default useAudioPlayer;
