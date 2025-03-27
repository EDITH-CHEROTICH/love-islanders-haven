
import React, { useState, useEffect } from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Sparkles, Link2 } from "lucide-react";
import { Button } from '@/components/ui/button';

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);

  // Check if a demo message has been shown, suggesting the n8n webhook isn't set
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

  const handleSupabaseDashboardClick = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-island-dark">
      <div className={`flex-1 container mx-auto ${isMobile ? 'max-w-full p-0' : 'p-4'}`}>
        {showApiKeyInfo && (
          <Alert className="mb-4 bg-amber-100 border-amber-200 text-amber-800">
            <InfoIcon className="h-5 w-5" />
            <AlertTitle>AI Companion is running in demo mode</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                To enable full functionality, please set up your n8n webhook URL in the Supabase Edge Function settings.
                The webhook URL needs to be added to the N8N_WEBHOOK_URL secret.
              </p>
              <p className="text-sm">
                Make sure your n8n workflow returns a JSON object with a "response" field containing the AI's reply.
              </p>
              <Button 
                variant="outline" 
                className="mt-2 w-fit bg-amber-200 hover:bg-amber-300 text-amber-900"
                onClick={handleSupabaseDashboardClick}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Go to Supabase Dashboard
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full">
          <div className="bg-island p-3 border-b border-island-light flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">Chat with Isla (powered by n8n)</h2>
              <Sparkles className="h-4 w-4 text-love" />
            </div>
          </div>
          <AICompanion />
        </div>
      </div>
    </div>
  );
};

export default AICompanionChat;
