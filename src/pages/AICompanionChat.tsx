
import React, { useState, useEffect } from 'react';
import AICompanion from '@/components/companion/AICompanion';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Sparkles, Link2, Webhook, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

const AICompanionChat: React.FC = () => {
  const isMobile = useIsMobile();
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const { user, isAuthenticated } = useAuth();

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

  const toggleSetupGuide = () => {
    setShowSetupGuide(!showSetupGuide);
  };

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
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  className="w-fit bg-amber-200 hover:bg-amber-300 text-amber-900"
                  onClick={handleSupabaseDashboardClick}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Go to Supabase Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-fit bg-amber-200 hover:bg-amber-300 text-amber-900"
                  onClick={toggleSetupGuide}
                >
                  <Webhook className="h-4 w-4 mr-2" />
                  {showSetupGuide ? 'Hide Setup Guide' : 'Show Setup Guide'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showSetupGuide && (
          <Alert className="mb-4 bg-blue-100 border-blue-200 text-blue-800">
            <InfoIcon className="h-5 w-5" />
            <AlertTitle>n8n Webhook Setup Guide</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a new workflow in n8n</li>
                <li>Add a "Webhook" trigger node as the starting point</li>
                <li>Configure it to receive POST requests</li>
                <li>Add a "Function" node to process the incoming data (including the user ID)</li>
                <li>Use the "Supabase" node to query user-specific data using the user ID</li>
                <li>Add processing nodes (like "HTTP Request" for AI APIs, etc.)</li>
                <li>Make sure your final node returns a JSON object with a <code className="bg-blue-200 px-1 rounded">response</code> field</li>
                <li>Deploy your workflow and copy the webhook URL</li>
                <li>Add the webhook URL as <code className="bg-blue-200 px-1 rounded">N8N_WEBHOOK_URL</code> in Supabase Edge Function secrets</li>
              </ol>
              <p className="mt-2 text-sm italic">
                The Edge Function will send the user ID (if available), message, and conversation history to your n8n workflow,
                which should process it and return the AI response.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-island rounded-lg overflow-hidden shadow-xl h-full">
          <div className="bg-island p-3 border-b border-island-light flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">Chat with Isla - Your Dating Companion</h2>
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
