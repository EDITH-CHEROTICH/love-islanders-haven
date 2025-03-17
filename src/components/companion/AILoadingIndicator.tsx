
import React from 'react';

const AILoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-island-light rounded-2xl rounded-tl-none px-4 py-2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingIndicator;
