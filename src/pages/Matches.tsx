
import { useState } from 'react';
import { useMatches } from '@/hooks/use-matches';
import { useBlockedUsers } from '@/hooks/use-blocked-users';
import MatchesHeader from '@/components/matches/MatchesHeader';
import MatchesList from '@/components/matches/MatchesList';
import InlineChat from '@/components/matches/InlineChat';

const Matches = () => {
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [activeChatMatchName, setActiveChatMatchName] = useState<string>('');
  const { matches, isLoading, error, refreshMatches } = useMatches();
  const { blockedUserIds, handleBlockUser, handleUnblockUser } = useBlockedUsers();
  
  const handleChatClick = (matchId: string, matchName: string) => {
    setActiveChatMatchId(matchId);
    setActiveChatMatchName(matchName);
  };
  
  const handleCloseChat = () => {
    setActiveChatMatchId(null);
  };
  
  const onBlockUser = async (match: any) => {
    const success = await handleBlockUser(match);
    // Close chat if the blocked user's chat is open
    if (success && activeChatMatchId === match.id) {
      handleCloseChat();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <MatchesHeader />
        
        <main className="container max-w-md mx-auto px-4">
          <MatchesList
            matches={matches}
            blockedUserIds={blockedUserIds}
            isLoading={isLoading}
            error={error}
            refreshMatches={refreshMatches}
            onChatClick={handleChatClick}
            onBlockUser={onBlockUser}
            onUnblockUser={handleUnblockUser}
          />
        </main>
      </div>
      
      {activeChatMatchId && (
        <InlineChat 
          matchId={activeChatMatchId} 
          matchName={activeChatMatchName}
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
};

export default Matches;
