
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

type AudioPlayerContextType = {
  playAudio: (id: string, src: string) => void;
  pauseAudio: () => void;
  isPlaying: boolean;
  currentAudioId: string | null;
};

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  playAudio: () => {},
  pauseAudio: () => {},
  isPlaying: false,
  currentAudioId: null,
});

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    
    // Set up event listeners
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentAudioId(null);
    };
    
    const handleError = (error: any) => {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setCurrentAudioId(null);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = (id: string, src: string) => {
    if (!audioRef.current) return;
    
    // If the same audio is already playing, pause it
    if (currentAudioId === id && isPlaying) {
      pauseAudio();
      return;
    }
    
    // If a different audio is playing, stop it first
    if (isPlaying) {
      audioRef.current.pause();
    }
    
    // Play the new audio
    try {
      audioRef.current.src = src;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentAudioId(id);
        })
        .catch((error) => {
          console.error('Failed to play audio:', error);
          setIsPlaying(false);
          setCurrentAudioId(null);
        });
    } catch (error) {
      console.error('Error setting up audio playback:', error);
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <AudioPlayerContext.Provider value={{ playAudio, pauseAudio, isPlaying, currentAudioId }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
