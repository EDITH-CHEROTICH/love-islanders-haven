
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import Message from './Message';
import ChatInput from './ChatInput';
import { Lightbulb } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'chat' | 'recommendation';
};

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch past conversation history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id) {
        setInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('ai_chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat history:', error);
          toast({
            title: "Couldn't load conversation history",
            description: error.message,
            variant: "destructive"
          });
        } else if (data && data.length > 0) {
          // Convert database records to chat messages
          const historyMessages = data.map((item) => ({
            id: item.id,
            role: item.role as 'user' | 'assistant',
            content: item.message_content,
            timestamp: new Date(item.created_at),
            type: (item.message_type as 'chat' | 'recommendation') || 'chat'
          }));
          
          setMessages(historyMessages);
        } else {
          // Add welcome message if no history exists
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            role: 'assistant',
            content: "Hi there! I'm Isla, your personal companion. I'm here to chat, listen, and keep you company. I can even give you suggestions for your streak posts based on your activity! How are you feeling today?",
            timestamp: new Date(),
            type: 'chat'
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [user?.id, toast]);

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
      timestamp: new Date(),
      type: 'chat'
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
          userId: user?.id  // Pass the user ID to enable personalization
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
        timestamp: new Date(),
        type: 'chat'
      };

      setMessages(prev => [...prev, aiMessage]);

      // After receiving the AI response, check for any new recommendations
      if (user?.id) {
        const { data: newMessages, error: fetchError } = await supabase
          .from('ai_chat_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('message_type', 'recommendation')
          .gt('created_at', aiMessage.timestamp.toISOString())
          .order('created_at', { ascending: true });

        if (!fetchError && newMessages && newMessages.length > 0) {
          // Add recommendations to the chat
          const recommendationMessages: ChatMessage[] = newMessages.map((item) => ({
            id: item.id,
            role: 'assistant' as const,
            content: item.message_content,
            timestamp: new Date(item.created_at),
            type: 'recommendation' as const
          }));
          
          setMessages(prev => [...prev, ...recommendationMessages]);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show appropriate error message to user
      let errorMessage = 'Failed to send message. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key is not set')) {
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
        timestamp: new Date(),
        type: 'chat'
      };
      
      setMessages(prev => [...prev, errorSystemMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-full max-h-[calc(100vh-76px)] bg-island-dark text-white">
        <div className="p-3 bg-island text-center border-b border-island-light">
          <h2 className="text-lg font-semibold text-white">Chat with Isla</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 bg-island-light rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-island-light rounded w-36"></div>
              <div className="h-4 bg-island-light rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-76px)] bg-island-dark text-white">
      <div className="p-3 bg-island text-center border-b border-island-light">
        <h2 className="text-lg font-semibold text-white">Chat with Isla</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className="mb-4">
            {message.type === 'recommendation' && (
              <div className="flex justify-start mb-2">
                <div className="bg-amber-700/30 rounded-lg p-3 max-w-[80%] flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-amber-400 font-medium mb-1">Streak Suggestion</div>
                    <div className="text-white">{message.content.replace('STREAK RECOMMENDATION:', '')}</div>
                  </div>
                </div>
              </div>
            )}
            {message.type !== 'recommendation' && (
              <Message
                message={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
            )}
          </div>
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
