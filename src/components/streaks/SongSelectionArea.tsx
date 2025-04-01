
import React from 'react';
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongData, SongOption } from "./types";
import SongSearchSection from "./SongSearchSection";
import SelectedSongDisplay from "./SelectedSongDisplay";

interface SongSelectionAreaProps {
  song: SongData | null;
  showSongInput: boolean;
  songTitle: string;
  setSongTitle: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  songOptions: SongOption[];
  isSubmitting?: boolean;
  onSongAdd: () => void;
  onSongSelect: (id: string) => void;
  onCancelSearch: () => void;
  onRemoveSong: () => void;
  clearSearch: () => void;
}

const SongSelectionArea = ({
  song,
  showSongInput,
  songTitle,
  setSongTitle,
  isSearching,
  songOptions,
  isSubmitting = false,
  onSongAdd,
  onSongSelect,
  onCancelSearch,
  onRemoveSong,
  clearSearch
}: SongSelectionAreaProps) => {
  return (
    <>
      {!song && !showSongInput && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSongAdd}
          className="flex items-center gap-2 w-full"
          disabled={isSubmitting}
        >
          <Music size={16} />
          <span>Add a song</span>
        </Button>
      )}

      <SongSearchSection
        showSongInput={showSongInput}
        songTitle={songTitle}
        setSongTitle={setSongTitle}
        isSearching={isSearching}
        songOptions={songOptions}
        clearSearch={clearSearch}
        onSongTitleChange={setSongTitle}
        onSongSelect={onSongSelect}
        onCancelSearch={onCancelSearch}
      />

      <SelectedSongDisplay
        song={song}
        onRemoveSong={onRemoveSong}
      />
    </>
  );
};

export default SongSelectionArea;
