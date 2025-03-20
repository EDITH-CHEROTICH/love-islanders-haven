import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches } from '@/utils/dummyData';
import { format } from 'date-fns';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { blockUser, unblockUser } from '@/services/profiles/blocking';
import NotificationBell from '@/components/NotificationBell';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Matches = () => {
  const [activeMatches, setActiveMatches] = useState(matches);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [activeChatMatchName, setActiveChatMatchName] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      try {
        const blockedUsers = await supabase
          .from('blocked_users')
          .select('blocked_user_id')
          .eq('user_id', user.id);
          
        if (blockedUsers.data) {
          setBlockedUserIds(blockedUsers.data.map(u => u.blocked_user_id));
        }
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };
    
    fetchBlockedUsers();
  }, []);
  
  const handleChatClick = (match: any) => {
    setActiveChatMatchId(match.id);
    setActiveChatMatchName(match.profile.name);
  };
  
  const handleCloseChat = () => {
    setActiveChatMatchId(null);
  };
  
  const handleBlockUser = async (match: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.profile.id;
    
    try {
      const { error } = await blockUser(user.id, matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds([...blockedUserIds, matchUserId]);
      
      toast({
        title: "User Blocked",
        description: `You have blocked ${match.profile.name}`,
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
    }
  };
  
  const handleUnblockUser = async (match: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.profile.id;
    
    try {
      const { error } = await unblockUser(user.id, matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds(blockedUserIds.filter(id => id !== matchUserId));
      
      toast({
        title: "User Unblocked",
        description: `You have unblocked ${match.profile.name}`,
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user",
        variant: "destructive",
      });
    }
  };
  
  // Filter out blocked matches
  const filteredMatches = activeMatches.filter(match => 
    !blockedUserIds.includes(match.profile.id)
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="flex items-center justify-between pt-4 mb-6 px-4">
          <h1 className="text-2xl font-bold text-gradient">Matches</h1>
          <NotificationBell />
        </header>
        
        <main className="container max-w-md mx-auto px-4">
          {filteredMatches.length > 0 ? (
            <div className="space-y-4 animate-fade-in">
              {filteredMatches.map((match) => (
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
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold flex items-center">
                          {match.profile.name}, {match.profile.age}
                          {match.profile.verified && (
                            <div className="ml-1 bg-blue-500 text-white rounded-full p-0.5">
                              <UserCheck size={12} />
                            </div>
                          )}
                        </h2>
                        <span className="text-xs text-muted-foreground">
                          {format(match.matchDate, 'h:mm a')}
                        </span>
                      </div>
                      
                      {match.lastMessage ? (
                        <p className="text-sm text-muted-foreground truncate mt-1 max-w-[calc(100%-60px)]">
                          {match.lastMessage.text}
                        </p>
                      ) : (
                        <p className="text-sm text-love-light mt-1 truncate max-w-[calc(100%-60px)]">
                          New match! Say hello
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <Button 
                        variant="ghost"
                        className="bg-love/10 hover:bg-love/20 p-2 rounded-full transition-all"
                        onClick={() => handleChatClick(match)}
                        aria-label="Open chat"
                      >
                        <MessageCircle size={20} className="text-love" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">More options</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!blockedUserIds.includes(match.profile.id) ? (
                            <DropdownMenuItem onClick={() => handleBlockUser(match)}>
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Block</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUnblockUser(match)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              <span>Unblock</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                  onClick={() => navigate('/discover')}
                  className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
                >
                  Continue Swiping
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      
      {activeChatMatchId && (
        <InlineChatOverlay 
          matchId={activeChatMatchId}
          matchName={activeChatMatchName}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default Matches;
