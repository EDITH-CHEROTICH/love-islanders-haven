
import React from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, LogIn } from "lucide-react";
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-island-dark">
      <div className={`flex-1 container mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'} overflow-hidden`}>
        {!isAuthenticated && (
          <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
            <User className="h-5 w-5" />
            <AlertTitle>Not logged in</AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <p>
                You're currently using the Dating Companion in guest mode. Sign in to save your chat history 
                and get personalized dating advice.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-fit border-amber-500 hover:bg-amber-200 text-amber-800"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </AlertDescription>
          </Alert>
        )}
      
        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full flex flex-col">
          <div className="bg-island p-3 border-b border-island-light flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">Chat with Isla - Your Dating Companion</h2>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <AICompanion />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
