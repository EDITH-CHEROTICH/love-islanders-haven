
import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflinePlaceholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-island-dark flex flex-col items-center justify-center p-4">
      <div className="bg-island-dark/80 backdrop-blur-md border border-island-light/30 rounded-lg p-8 max-w-md w-full text-center">
        <WifiOff className="h-16 w-16 mx-auto text-love mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">You're offline</h1>
        <p className="text-gray-300 mb-6">
          Please check your internet connection and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default OfflinePlaceholder;
