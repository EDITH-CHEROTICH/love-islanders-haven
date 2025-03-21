
import React from "react";
import { SongData } from "./types";
import StreakPostFormContainer from "./StreakPostFormContainer";

interface StreakPostFormProps {
  onSubmit: (data: { content: string; caption?: string; song?: SongData; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: StreakPostFormProps) => {
  return (
    <StreakPostFormContainer
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default StreakPostForm;
