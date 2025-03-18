
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches } from '@/utils/dummyData';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const Matches = () => {
  const [activeMatches, setActiveMatches] = useState(matches);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleChatClick = (match: any) => {
    navigate(`/messages/${match.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">Matches</h1>
        </header>
        
        <main className="container max-w-md mx-auto px-4">
          {activeMatches.length > 0 ? (
            <div className="space-y-4 animate-fade-in">
              {activeMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="border-love/20 backdrop-blur-md bg-island-light/20 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 flex items-center">
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
                    
                    <Button 
                      variant="ghost"
                      className="ml-2 bg-love/10 hover:bg-love/20 p-2 rounded-full transition-all"
                      onClick={() => handleChatClick(match)}
                      aria-label="Open chat"
                    >
                      <MessageCircle size={20} className="text-love" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-love/20 backdrop-blur-md bg-island-light/20 animate-fade-in">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
                <p className="text-muted-foreground mb-6">
                  Keep swiping to find your match!
                </p>
                <Button 
                  className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
                >
                  Continue Swiping
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Matches;
