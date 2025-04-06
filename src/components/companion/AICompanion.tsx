
import React, { useState, useEffect } from 'react';
import InlineChatContainer from './InlineChatContainer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { MessageType } from './types';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Load chat history on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadChatHistory();
    } else {
      // If not authenticated, show welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Welcome to Isla, your dating companion! I can help you with dating advice, profile feedback, and conversation starters. How can I assist you today?',
          timestamp: new Date(),
          type: 'chat'
        }
      ]);
    }
  }, [isAuthenticated, user]);
  
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform database records to MessageType format
        const formattedMessages: MessageType[] = data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.message_content,
          timestamp: new Date(msg.created_at),
          type: msg.message_type as 'chat' | 'recommendation' | 'proactive' | undefined
        }));
        
        setMessages(formattedMessages);
      } else {
        // If no history, set welcome message
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Welcome to Isla, your dating companion! I can help you with dating advice, profile feedback, and conversation starters. How can I assist you today?',
            timestamp: new Date(),
            type: 'chat'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
    
    // Create new user message
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      type: 'chat'
    };
    
    // Optimistically update UI with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Start loading state for AI response
    setIsLoading(true);
    
    try {
      // Save user message to database if authenticated
      if (isAuthenticated && user?.id) {
        await supabase.from('ai_chat_history').insert({
          id: userMessage.id,
          user_id: user.id,
          role: userMessage.role,
          message_content: userMessage.content,
          message_type: userMessage.type || 'chat'
        });
      }
      
      // Call AI assistant API
      const response = await fetch('/api/ai-companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          userId: user?.id || 'guest'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI companion');
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage: MessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message || "I'm sorry, I couldn't process your request right now.",
        timestamp: new Date(),
        type: data.type || 'chat'
      };
      
      // Update UI with assistant response
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Save assistant message to database if authenticated
      if (isAuthenticated && user?.id) {
        await supabase.from('ai_chat_history').insert({
          id: assistantMessage.id,
          user_id: user.id,
          role: assistantMessage.role,
          message_content: assistantMessage.content,
          message_type: assistantMessage.type || 'chat'
        });
      }
    } catch (error) {
      console.error('Error sending message to AI companion:', error);
      toast.error('Failed to get a response. Please try again.');
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, I encountered a problem. Please try again later.',
          timestamp: new Date(),
          type: 'chat'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full w-full">
      <InlineChatContainer 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSendMessage} 
      />
    </ScrollArea>
  );
};

export default AICompanion;
