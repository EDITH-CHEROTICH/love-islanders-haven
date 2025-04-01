
import React from 'react';
import { SongOption } from './types';

interface SongListProps {
  songs: SongOption[];
  onSelectSong: (id: string) => void;
}

const SongList: React.FC<SongListProps> = ({ 
  songs, 
  onSelectSong 
}) => {
  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/20 rounded-md max-h-48 overflow-y-auto">
      <ul>
        {songs.map((song) => (
          <li 
            key={song.id}
            className="p-2 hover:bg-black/30 cursor-pointer flex items-center space-x-2"
            onClick={() => onSelectSong(song.id)}
          >
            {song.album_art && (
              <img 
                src={song.album_art} 
                alt={song.title} 
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-sm opacity-80">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
