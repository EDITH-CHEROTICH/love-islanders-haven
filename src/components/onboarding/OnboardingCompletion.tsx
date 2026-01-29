import { Check, Heart, MessageCircle, Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export const OnboardingCompletion = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30 flex flex-col items-center py-12 relative overflow-hidden">
      {/* Animated confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="h-4 w-4 text-love opacity-60" />
            </div>
          ))}
        </div>
      )}
      
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-love to-love-dark flex items-center justify-center mb-6 animate-pulse">
        <Heart className="h-10 w-10 text-white fill-white" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-love to-love-light bg-clip-text text-transparent">
        You're All Set!
      </h1>
      
      <p className="text-gray-300 mb-8 text-center max-w-xs">
        Your profile is ready. Time to start swiping and meeting amazing people!
      </p>
      
      <div className="w-full space-y-4 mb-8">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-island-light/10">
          <div className="w-10 h-10 rounded-full bg-love/20 flex items-center justify-center">
            <Search className="h-5 w-5 text-love" />
          </div>
          <div>
            <h3 className="font-medium">Discover</h3>
            <p className="text-sm text-gray-400">Browse and swipe on profiles</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-island-light/10">
          <div className="w-10 h-10 rounded-full bg-love/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-love" />
          </div>
          <div>
            <h3 className="font-medium">Match</h3>
            <p className="text-sm text-gray-400">Like someone? They might like you too!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-island-light/10">
          <div className="w-10 h-10 rounded-full bg-love/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-love" />
          </div>
          <div>
            <h3 className="font-medium">Connect</h3>
            <p className="text-sm text-gray-400">Chat and get to know each other</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-love flex items-center justify-center mb-2">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm text-gray-400">Taking you to discover...</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCompletion;
