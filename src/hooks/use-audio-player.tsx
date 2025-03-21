
import { useState, useRef, useEffect, createContext, useContext } from "react";

// Create a context for the audio player
interface AudioPlayerContextType {
  isPlaying: boolean;
  currentAudioId: string | null;
  currentSrc: string | null;
  volume: number;
  playAudio: (id: string, url: string) => void;
  stopAudio: () => void;
  togglePlayPause: (url: string) => void;
  changeVolume: (volume: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
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
      setCurrentSrc(audioUrl);
      
      // Set up ended event to reset the playing state
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentAudioId(null);
        setCurrentSrc(null);
      };

      // Add error handling
      audioRef.current.onerror = (error) => {
        console.error("Audio playback error:", error);
        console.log("Attempted to play URL:", audioUrl);
        setIsPlaying(false);
        setCurrentAudioId(null);
        setCurrentSrc(null);
        
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
        setCurrentSrc(null);
        
        // Try fallback if original URL failed
        if (audioUrl !== fallbackUrl) {
          console.log("Trying fallback audio URL after play failure");
          playAudio(id, fallbackUrl);
        }
      });
    }
  };

  const togglePlayPause = (url: string) => {
    if (!url) {
      console.log("No audio URL provided for togglePlayPause");
      return;
    }

    if (isPlaying && currentSrc === url) {
      // If already playing this URL, pause it
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (isPlaying && currentSrc !== url) {
      // If playing another URL, stop it and play the new one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;
      setCurrentSrc(url);
      
      // Set up ended event
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentSrc(null);
      };
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setCurrentSrc(null);
      });
    } else {
      // Not playing, so start playing
      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;
      setCurrentSrc(url);
      
      // Set up ended event
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentSrc(null);
      };
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setCurrentSrc(null);
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentSrc(null);
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

  const value = {
    isPlaying,
    currentAudioId,
    currentSrc,
    volume,
    playAudio,
    stopAudio,
    togglePlayPause,
    changeVolume
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Hook to use the audio player context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};

export default useAudioPlayer;
