import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface MessageHeaderProps {
  matchInfo: {
    profile: {
      id: string;
      name: string;
      images: string[];
      verified?: boolean;
    }
  };
  onBackClick: () => void;
  actions?: React.ReactNode;
}

const MessageHeader = ({ matchInfo, onBackClick, actions }: MessageHeaderProps) => {
  
  return (
    <div className="border-b p-3 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2 md:hidden">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-9 w-9 mr-2">
          <AvatarImage src={matchInfo.profile.images[0]} alt={matchInfo.profile.name} />
          <AvatarFallback>{matchInfo.profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium flex items-center">
            {matchInfo.profile.name}
            {matchInfo.profile.verified && (
              <span className="ml-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Active now</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {actions}
        <Button variant="ghost" size="icon" className="text-love">
          <Phone className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-love">
          <Video className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Block user</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MessageHeader;
