
import React from 'react';
import { format } from 'date-fns';
import { MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MatchListProps {
  matches: any[];
  blockedUserIds: string[];
  onChatClick: (match: any) => void;
  onBlockUser: (match: any) => void;
  onUnblockUser: (match: any) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  blockedUserIds,
  onChatClick,
  onBlockUser,
  onUnblockUser
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {matches.map((match) => (
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
                onClick={() => onChatClick(match)}
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
      ))}
    </div>
  );
};

export default MatchList;
