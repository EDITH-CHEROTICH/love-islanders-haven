
import React, { useState } from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "lucide-react";
import { useAuth } from '@/context/auth';

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-island-dark">
      <div className={`flex-1 container mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'}`}>
        {!isAuthenticated && (
          <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
            <User className="h-5 w-5" />
            <AlertTitle>Not logged in</AlertTitle>
            <AlertDescription>
              You're currently using the Dating Companion in guest mode. Sign in to save your chat history 
              and get personalized dating advice.
            </AlertDescription>
          </Alert>
        )}
      
        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full">
          <div className="bg-island p-3 border-b border-island-light flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">Chat with Isla - Your Dating Companion</h2>
            </div>
          </div>
          <AICompanion />
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
