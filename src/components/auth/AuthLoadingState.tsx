
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const AuthLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <Spinner className="h-12 w-12 text-love" />
    </div>
  );
};

export default AuthLoadingState;
