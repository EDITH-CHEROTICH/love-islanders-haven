
import { useState } from 'react';
import { matches } from '../utils/dummyData';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Matches = () => {
  const [activeMatches, setActiveMatches] = useState(matches);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{[key: string]: Array<{text: string, sender: 'user' | 'match'}>}>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChatClick = (match: any) => {
    setSelectedMatch(match);
    
    // Initialize chat messages if they don't exist
    if (!chatMessages[match.id]) {
      setChatMessages({
        ...chatMessages,
        [match.id]: match.lastMessage ? [{text: match.lastMessage.text, sender: 'match'}] : []
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedMatch) return;
    
    // Add user message to chat
    const updatedMessages = {
      ...chatMessages,
      [selectedMatch.id]: [
        ...(chatMessages[selectedMatch.id] || []),
        {text: chatMessage, sender: 'user' as const}
      ]
    };
    
    setChatMessages(updatedMessages);
    setChatMessage('');
    
    // Simulate match response after a delay
    setTimeout(() => {
      const matchResponse = {
        text: `Hi there! Thanks for your message: "${chatMessage}"`,
        sender: 'match' as const
      };
      
      setChatMessages({
        ...updatedMessages,
        [selectedMatch.id]: [
          ...updatedMessages[selectedMatch.id],
          matchResponse
        ]
      });
      
      toast({
        title: "New Message",
        description: `${selectedMatch.profile.name} has responded to your message!`,
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-6">
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
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost"
                        className="ml-2 bg-love/10 hover:bg-love/20 p-2 rounded-full transition-all"
                        onClick={() => handleChatClick(match)}
                        aria-label="Open chat"
                      >
                        <MessageCircle size={20} className="text-love" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={match.profile.images[0]} 
                              alt={match.profile.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{match.profile.name}, {match.profile.age}</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="flex flex-col h-[300px]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
                          {selectedMatch && (chatMessages[selectedMatch.id]?.length > 0 ? (
                            chatMessages[selectedMatch.id].map((msg, index) => (
                              <div 
                                key={index} 
                                className={`${
                                  msg.sender === 'user' 
                                    ? 'ml-auto bg-love/80 text-white' 
                                    : 'mr-auto bg-gray-700/60 text-white'
                                } p-3 rounded-lg max-w-[80%]`}
                              >
                                {msg.text}
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              No messages yet. Say hello to {match.profile.name}!
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-4 border-t border-gray-700/50">
                          <div className="flex gap-2">
                            <Input
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="Type a message..."
                              className="flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendMessage();
                              }}
                            />
                            <Button onClick={handleSendMessage}>Send</Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
      </div>
      
      <Navbar />
    </div>
  );
};

export default Matches;
