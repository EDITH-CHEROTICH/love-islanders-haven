
import React from 'react';
import NotificationBell from '@/components/NotificationBell';

const MatchesHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between pt-4 mb-6 px-4">
      <h1 className="text-2xl font-bold text-gradient">Matches</h1>
      <NotificationBell />
    </header>
  );
};

export default MatchesHeader;
