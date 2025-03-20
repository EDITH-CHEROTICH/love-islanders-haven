
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InlineChatHeaderProps {
  matchName: string;
  onClose: () => void;
}

const InlineChatHeader: React.FC<InlineChatHeaderProps> = ({ matchName, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-white">{matchName}</h2>
      <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default InlineChatHeader;
