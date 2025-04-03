
import React, { useState, useEffect } from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Sparkles, BrainCircuit, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import AdSense from '@/components/AdSense';

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Check if a demo message has been shown, suggesting the API integration isn't working
  useEffect(() => {
    const checkForDemoMode = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'ai-companion-demo-mode') {
          setShowApiKeyInfo(true);
        }
      } catch (err) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', checkForDemoMode);
    return () => window.removeEventListener('message', checkForDemoMode);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-island-dark">
      <div className="page-container pt-4 pb-20">
        <div className={`container mx-auto ${isMobile ? 'max-w-full px-2' : 'px-4'}`}>
          {!isAuthenticated && (
            <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
              <User className="h-5 w-5" />
              <AlertTitle>Not logged in</AlertTitle>
              <AlertDescription>
                You're currently using Isla in guest mode. Sign in to save your chat history 
                and get personalized dating advice.
              </AlertDescription>
            </Alert>
          )}
        
          {showApiKeyInfo && (
            <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
              <InfoIcon className="h-5 w-5" />
              <AlertTitle>AI Companion connection issue</AlertTitle>
              <AlertDescription>
                Isla is currently having trouble connecting to the OpenAI API. Please check that the OPENAI_API_KEY has been correctly set up in Supabase Edge Functions.
              </AlertDescription>
            </Alert>
          )}

          <Alert className="mb-4 bg-green-100 border-green-200 text-green-800">
            <BrainCircuit className="h-5 w-5" />
            <AlertTitle>Advanced AI Powered by GPT-4o</AlertTitle>
            <AlertDescription>
              Isla is now powered by OpenAI's GPT-4o, offering more sophisticated, personalized conversations and dating advice.
            </AlertDescription>
          </Alert>

          <div className="bg-island rounded-lg overflow-hidden shadow-xl h-[calc(100vh-160px)]">
            <div className="bg-island p-3 border-b border-island-light flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-white">Chat with Isla - Your Dating Companion</h2>
                <Sparkles className="h-4 w-4 text-love" />
              </div>
            </div>
            <AICompanion />
          </div>
          
          {/* Add AdSense component at the bottom */}
          <div className="mt-4">
            <AdSense slot="7259370550" format="auto" responsive={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
