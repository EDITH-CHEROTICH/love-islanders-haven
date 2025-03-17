
import { useState, useEffect } from "react";
import { SongOption } from "@/components/streaks/types";

export const useSongSearch = () => {
  const [songTitle, setSongTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [songOptions, setSongOptions] = useState<SongOption[]>([]);

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (songTitle.trim()) {
        searchSongs(songTitle);
      } else {
        setSongOptions([]);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [songTitle]);

  const searchSongs = (title: string) => {
    if (!title.trim()) {
      setSongOptions([]);
      return;
    }

    setIsSearching(true);
    
    // In a real implementation, this would call a music API
    // For demo purposes, we'll create some dummy results with preview URLs
    setTimeout(() => {
      const dummyResults: SongOption[] = [
        {
          id: "1",
          title: title,
          artist: "Taylor Swift",
          album_art: "/placeholder.svg",
          preview_url: "https://p.scdn.co/mp3-preview/18106d92a76419b8fc2cfce921483fbf7de0378f"
        },
        {
          id: "2",
          title: title,
          artist: "Ed Sheeran",
          album_art: "/placeholder.svg",
          preview_url: "https://p.scdn.co/mp3-preview/5a52a3e5743ab55bb6e8eb1c56f200c20cd4cace"
        },
        {
          id: "3",
          title: title,
          artist: "Beyoncé",
          album_art: "/placeholder.svg",
          preview_url: "https://p.scdn.co/mp3-preview/f7a6b2bd7067b31356a346ac6b55a0c3c453a80e"
        },
        {
          id: "4",
          title: title,
          artist: "Drake",
          album_art: "/placeholder.svg",
          preview_url: "https://p.scdn.co/mp3-preview/4839278c6e26dd6ce2fdc27f70a05cc2341928f3"
        },
        {
          id: "5",
          title: title,
          artist: "The Weeknd",
          album_art: "/placeholder.svg",
          preview_url: "https://p.scdn.co/mp3-preview/8b1ef36d67a653cca3a530a21abbd8f95dc8a2e6"
        }
      ];
      
      setSongOptions(dummyResults);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSongTitle("");
    setSongOptions([]);
  };

  return {
    songTitle,
    setSongTitle,
    isSearching,
    songOptions,
    clearSearch
  };
};

export default useSongSearch;
