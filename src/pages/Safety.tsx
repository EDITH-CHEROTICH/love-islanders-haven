
import React from 'react';
import DateSafety from '@/components/safety/DateSafety';

const Safety: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Safety Center</h1>
        <DateSafety matchId="" matchName="" />
      </div>
    </div>
  );
};

export default Safety;
