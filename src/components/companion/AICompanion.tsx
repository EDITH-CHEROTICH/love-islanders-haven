
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

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('ai_chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedMessages = data.map((msg): ChatMessage => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.message_content,
          timestamp: new Date(msg.created_at)
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast({
          title: "Failed to load chat history",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };

    if (user) {
      loadChatHistory();
    }
  }, [user, toast]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

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
      // Store user message in database
      const { error: insertError } = await supabase
        .from('ai_chat_history')
        .insert({
          user_id: user.id,
          message_content: messageText,
          role: 'user'
        });

      if (insertError) throw insertError;

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
          userId: user.id
        }
      });

      if (error) throw error;

      // Store AI response in database
      const { error: aiInsertError } = await supabase
        .from('ai_chat_history')
        .insert({
          user_id: user.id,
          message_content: data.response,
          role: 'assistant'
        });

      if (aiInsertError) throw aiInsertError;

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
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive"
      });
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
