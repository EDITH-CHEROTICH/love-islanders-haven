
import React from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useMediaQuery } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';

const AICompanionChat: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="flex flex-col h-screen bg-island-dark">
      <Navbar />
      <div className={`flex-1 container mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'}`}>
        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full">
          <AICompanion />
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
