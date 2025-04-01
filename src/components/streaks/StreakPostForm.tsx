
import React from "react";
import StreakPostFormContainer from "./StreakPostFormContainer";

interface StreakPostFormProps {
  onSubmit: (data: { content: string[]; caption?: string; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: StreakPostFormProps) => {
  // Pass the props directly to the container component
  return (
    <StreakPostFormContainer
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default StreakPostForm;
