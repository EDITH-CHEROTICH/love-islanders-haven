
import React, { useState, useEffect } from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);

  // Check if a demo message has been shown, suggesting the API key isn't set
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
      <Navbar />
      <div className={`flex-1 container mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'}`}>
        {showApiKeyInfo && (
          <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
            <InfoIcon className="h-5 w-5" />
            <AlertTitle>AI Companion is running in demo mode</AlertTitle>
            <AlertDescription>
              To enable full functionality, please set up your OpenAI API key in the Supabase Edge Function settings.
              The API key needs to be added to the OPENAI_API_KEY secret.
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full">
          <AICompanion />
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
