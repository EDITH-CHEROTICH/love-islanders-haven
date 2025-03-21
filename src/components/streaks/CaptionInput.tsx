
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface CaptionInputProps {
  caption: string;
  onCaptionChange: (value: string) => void;
  disabled?: boolean;
}

const CaptionInput = ({
  caption,
  onCaptionChange,
  disabled = false
}: CaptionInputProps) => {
  return (
    <div>
      <label htmlFor="caption" className="block text-sm font-medium mb-1">
        Caption (optional)
      </label>
      <Textarea
        id="caption"
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
        placeholder="Add a caption to your streak post..."
        disabled={disabled}
      />
    </div>
  );
};

export default CaptionInput;
