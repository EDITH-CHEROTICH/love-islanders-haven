
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Message from './Message';
import ChatInput from './ChatInput';
import RecommendationMessage from './RecommendationMessage';
import AILoadingIndicator from './AILoadingIndicator';
import { ChatMessage } from './types';
import { 
  fetchChatHistory, 
  sendAIMessage, 
  fetchRecommendations,
  getWelcomeMessage
} from './aiCompanionService';

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch past conversation history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user?.id) {
        setInitialLoading(false);
        return;
      }

      try {
        const historyMessages = await fetchChatHistory(user.id);
        
        if (historyMessages && historyMessages.length > 0) {
          setMessages(historyMessages);
        } else {
          // Add welcome message if no history exists
          setMessages([getWelcomeMessage()]);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Couldn't load conversation history",
          description: error instanceof Error ? error.message : 'Unknown error occurred',
          variant: "destructive"
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadChatHistory();
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

      // Send message to AI service
      const aiResponse = await sendAIMessage(messageText, conversationHistory, user?.id);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'chat'
      };

      setMessages(prev => [...prev, aiMessage]);

      // After receiving the AI response, check for any new recommendations
      if (user?.id) {
        try {
          const recommendationMessages = await fetchRecommendations(user.id, aiMessage.timestamp);
          if (recommendationMessages.length > 0) {
            setMessages(prev => [...prev, ...recommendationMessages]);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
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
            {message.type === 'recommendation' ? (
              <RecommendationMessage content={message.content} />
            ) : (
              <Message
                message={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && <AILoadingIndicator />}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default AICompanion;
