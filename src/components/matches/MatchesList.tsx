
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Match } from '@/services/matches';
import MatchCard from './MatchCard';

interface MatchesListProps {
  matches: Match[];
  blockedUserIds: string[];
  isLoading: boolean;
  error: Error | null;
  refreshMatches: () => void;
  onChatClick: (matchId: string, matchName: string) => void;
  onBlockUser: (match: Match) => void;
  onUnblockUser: (match: Match) => void;
}

const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  blockedUserIds,
  isLoading,
  error,
  refreshMatches,
  onChatClick,
  onBlockUser,
  onUnblockUser,
}) => {
  // Filter out blocked matches
  const filteredMatches = matches.filter(match => 
    !blockedUserIds.includes(match.otherUser.id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-love border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-love/20 backdrop-blur-md bg-island-light/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Matches</h2>
          <p className="text-muted-foreground mb-6">
            There was a problem loading your matches. Please try again.
          </p>
          <Button 
            onClick={refreshMatches}
            className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredMatches.length === 0) {
    return (
      <Card className="border-love/20 backdrop-blur-md bg-island-light/20 animate-fade-in">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
          <p className="text-muted-foreground mb-6">
            Keep swiping to find your match!
          </p>
          <Button 
            onClick={() => window.location.href = '/discover'}
            className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
          >
            Continue Swiping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {filteredMatches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          blockedUserIds={blockedUserIds}
          onChatClick={onChatClick}
          onBlockUser={onBlockUser}
          onUnblockUser={onUnblockUser}
        />
      ))}
    </div>
  );
};

export default MatchesList;
