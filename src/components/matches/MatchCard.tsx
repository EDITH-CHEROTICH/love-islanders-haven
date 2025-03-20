
import React from 'react';
import { format } from 'date-fns';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Match } from '@/services/matches';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MatchCardProps {
  match: Match;
  blockedUserIds: string[];
  onChatClick: (matchId: string, matchName: string) => void;
  onBlockUser: (match: Match) => void;
  onUnblockUser: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  blockedUserIds,
  onChatClick,
  onBlockUser,
  onUnblockUser,
}) => {
  return (
    <Card className="border-love/20 backdrop-blur-md bg-island-light/20 hover:shadow-md transition-all">
      <CardContent className="p-4 flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <img 
            src={match.otherUser.images && match.otherUser.images.length > 0 
              ? match.otherUser.images[0] 
              : '/placeholder.svg'} 
            alt={match.otherUser.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center">
              {match.otherUser.name}
              {match.otherUser.age && `, ${match.otherUser.age}`}
              {match.otherUser.verified && (
                <div className="ml-1 bg-blue-500 text-white rounded-full p-0.5">
                  <UserCheck size={12} />
                </div>
              )}
            </h2>
            <span className="text-xs text-muted-foreground">
              {format(new Date(match.matched_at), 'MMM d')}
            </span>
          </div>
          
          {match.lastMessage ? (
            <p className="text-sm text-muted-foreground truncate mt-1">
              {match.lastMessage.content}
            </p>
          ) : (
            <p className="text-sm text-love-light mt-1">
              New match! Say hello
            </p>
          )}
        </div>
        
        <div className="flex items-center ml-2">
          <Button 
            variant="ghost"
            className="bg-love/10 hover:bg-love/20 p-2 rounded-full transition-all relative"
            onClick={() => onChatClick(match.id, match.otherUser.name)}
            aria-label="Open chat"
          >
            <MessageCircle size={20} className="text-love" />
            {match.hasUnreadMessages && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center rounded-full text-[10px]"
              >
                {match.unreadCount > 9 ? '9+' : match.unreadCount}
              </Badge>
            )}
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
              {!blockedUserIds.includes(match.otherUser.id) ? (
                <DropdownMenuItem onClick={() => onBlockUser(match)}>
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Block</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onUnblockUser(match)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Unblock</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
