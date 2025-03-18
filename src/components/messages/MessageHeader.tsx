
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MessageHeaderProps {
  matchInfo: any;
  onBackClick: () => void;
}

const MessageHeader = ({ matchInfo, onBackClick }: MessageHeaderProps) => {
  return (
    <header className="sticky top-0 bg-island-dark z-10 p-4 flex items-center border-b border-island-light/20">
      <button 
        onClick={onBackClick}
        className="mr-4 text-white"
        aria-label="Back to matches"
      >
        <ArrowLeft size={24} />
      </button>
      
      {matchInfo?.otherUser ? (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src="/placeholder.svg" 
              alt={matchInfo.otherUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {matchInfo.otherUser.name}
            </h1>
            <p className="text-xs text-white/60">
              {matchInfo.otherUser.verified ? 'Verified ✓' : 'Not verified'}
            </p>
          </div>
        </div>
      ) : (
        <h1 className="text-lg font-semibold text-white">Loading...</h1>
      )}
    </header>
  );
};

export default MessageHeader;
