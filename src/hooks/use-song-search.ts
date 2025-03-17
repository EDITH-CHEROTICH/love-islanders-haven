
import { useState, useEffect } from "react";
import { SongOption } from "@/components/streaks/types";

// Spotify API credentials
const SPOTIFY_CLIENT_ID = "eda41643ae534b7791d1e53b2ce7d499";
const SPOTIFY_CLIENT_SECRET = "8200dcaf21e041a5b19860cf34b4e4ed";

export const useSongSearch = () => {
  const [songTitle, setSongTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [songOptions, setSongOptions] = useState<SongOption[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get Spotify access token when the hook is initialized
  useEffect(() => {
    const getSpotifyToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
          },
          body: "grant_type=client_credentials"
        });

        const data = await response.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
          console.log("Spotify token obtained successfully");
        }
      } catch (error) {
        console.error("Error fetching Spotify access token:", error);
      }
    };

    getSpotifyToken();
  }, []);

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    if (!accessToken) return;
    
    const timeoutId = setTimeout(() => {
      if (songTitle.trim()) {
        searchSongs(songTitle);
      } else {
        setSongOptions([]);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [songTitle, accessToken]);

  const searchSongs = async (title: string) => {
    if (!title.trim() || !accessToken) {
      setSongOptions([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          title
        )}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      
      if (data.tracks && data.tracks.items) {
        const tracks = data.tracks.items.map((track: any) => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(", "),
          album_art: track.album.images[0]?.url || "/placeholder.svg",
          preview_url: track.preview_url
        }));
        
        setSongOptions(tracks);
      }
    } catch (error) {
      console.error("Error searching Spotify:", error);
      // Fallback to dummy data if the API fails
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
        }
      ];
      
      setSongOptions(dummyResults);
    } finally {
      setIsSearching(false);
    }
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
