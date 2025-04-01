
import React from 'react';
import { Button } from '@/components/ui/button';

interface CancelButtonProps {
  visible: boolean;
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ 
  visible, 
  onClick 
}) => {
  if (!visible) return null;
  
  return (
    <Button 
      type="button" 
      variant="ghost" 
      onClick={onClick}
      size="sm"
    >
      Cancel
    </Button>
  );
};

export default CancelButton;
