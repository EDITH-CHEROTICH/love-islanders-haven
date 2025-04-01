
import { useState } from 'react';
import { matches } from '@/utils/dummyData';
import NotificationBell from '@/components/NotificationBell';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import MatchList from '@/components/matches/MatchList';
import EmptyMatchState from '@/components/matches/EmptyMatchState';
import { useMatchActions } from '@/hooks/use-match-actions';
import { useBlockedUsers } from '@/hooks/use-blocked-users';

const Matches = () => {
  const [activeMatches, setActiveMatches] = useState(matches);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [activeChatMatchName, setActiveChatMatchName] = useState<string>('');
  
  const { blockedUserIds, setBlockedUserIds } = useBlockedUsers();
  const { handleBlockUser, handleUnblockUser } = useMatchActions();
  
  const handleChatClick = (match: any) => {
    setActiveChatMatchId(match.id);
    setActiveChatMatchName(match.profile.name);
  };
  
  const handleCloseChat = () => {
    setActiveChatMatchId(null);
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
            <MatchList 
              matches={filteredMatches}
              blockedUserIds={blockedUserIds}
              onChatClick={handleChatClick}
              onBlockUser={handleBlockUser}
              onUnblockUser={handleUnblockUser}
            />
          ) : (
            <EmptyMatchState />
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
