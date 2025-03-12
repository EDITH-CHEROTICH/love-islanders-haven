
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Message from './Message';
import ChatInput from './ChatInput';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'm Isla, your personal companion. I'm here to chat, listen, and keep you company. How are you feeling today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-companion', {
        body: {
          message: messageText,
          conversationHistory,
          userId: user?.id
        }
      });

      if (error) {
        console.error('Error from Supabase function:', error);
        throw new Error(error.message || 'Failed to get response from AI companion');
      }

      if (!data || !data.response) {
        if (data && data.error) {
          console.error('Error from AI service:', data.error);
          throw new Error(data.error);
        }
        throw new Error('Invalid response from AI companion');
      }

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show appropriate error message to user
      let errorMessage = 'Failed to send message. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('OPENAI_API_KEY is not set')) {
          errorMessage = 'The AI service is not properly configured. Please contact support.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "AI Companion Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Add error message as system message
      const errorSystemMessage: ChatMessage = {
        id: `error-${Date.now().toString()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to my servers right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorSystemMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-76px)] bg-island-dark text-white">
      <div className="p-3 bg-island text-center border-b border-island-light">
        <h2 className="text-lg font-semibold text-white">Chat with Isla</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <Message
            key={message.id}
            message={message.content}
            isUser={message.role === 'user'}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-island-light rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default AICompanion;
