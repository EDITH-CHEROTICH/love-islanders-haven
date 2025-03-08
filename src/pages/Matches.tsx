
import { useState } from 'react';
import { matches } from '../utils/dummyData';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const [activeMatches, setActiveMatches] = useState(matches);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChatClick = (matchId: string) => {
    // In a real app, this would navigate to a chat page with the specific match
    toast({
      title: "Chat Opened",
      description: `Starting conversation with match #${matchId}`,
    });
    
    // This is a placeholder - in a real app you would navigate to a chat page
    // navigate(`/chat/${matchId}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Matches</h1>
      </header>
      
      <main className="container max-w-md mx-auto px-4">
        {activeMatches.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {activeMatches.map((match) => (
              <div 
                key={match.id} 
                className="glass-card p-4 flex items-center hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <img 
                    src={match.profile.images[0]} 
                    alt={match.profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{match.profile.name}, {match.profile.age}</h2>
                    <span className="text-xs text-muted-foreground">
                      {format(match.matchDate, 'MMM d')}
                    </span>
                  </div>
                  
                  {match.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {match.lastMessage.text}
                    </p>
                  ) : (
                    <p className="text-sm text-love-light mt-1">
                      New match! Say hello
                    </p>
                  )}
                </div>
                
                <button 
                  className="ml-2 bg-love/10 hover:bg-love/20 p-2 rounded-full transition-all"
                  onClick={() => handleChatClick(match.id)}
                  aria-label="Open chat"
                >
                  <MessageCircle size={20} className="text-love" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">
              Keep swiping to find your match!
            </p>
            <button 
              onClick={() => {}}
              className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
            >
              Continue Swiping
            </button>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Matches;
