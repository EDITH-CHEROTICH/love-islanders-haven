import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatMessage } from './types';
import Message from './Message';
import ChatInput from './ChatInput';
import AILoadingIndicator from './AILoadingIndicator';
import RecommendationMessage from './RecommendationMessage';
import { sendAIMessage, getWelcomeMessage, fetchChatHistory, fetchProactiveMessages, fetchRecommendations } from './aiCompanionService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Optional logging for debugging
const DEBUG = false;

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Debug logging helper
  const log = (...args: any[]) => {
    if (DEBUG) console.log('[AICompanion]', ...args);
  };

  useEffect(() => {
    // Initialize with welcome message if no history
    if (messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
    
    // Load chat history for authenticated users
    const loadChatHistory = async () => {
      if (isAuthenticated && user?.id) {
        try {
          log('Loading chat history for user:', user.id);
          const history = await fetchChatHistory(user.id);
          if (history && history.length > 0) {
            log('Loaded chat history:', history.length, 'messages');
            setMessages(history);
            setChatHistory(history);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
          toast({
            title: 'Could not load chat history',
            description: 'There was a problem loading your previous conversations.',
            variant: 'destructive',
          });
        }
      }
    };
    
    loadChatHistory();
  }, [isAuthenticated, user, toast]);
  
  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to the bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Proactive message check
  useEffect(() => {
    const checkNewMessages = async () => {
      if (isAuthenticated && user?.id) {
        try {
          log('Checking for new proactive messages since:', lastChecked);
          const newProactiveMessages = await fetchProactiveMessages(user.id, lastChecked);
          const newRecommendationMessages = await fetchRecommendations(user.id, lastChecked);
          
          if (newProactiveMessages && newProactiveMessages.length > 0) {
            log('New proactive messages found:', newProactiveMessages.length);
            setMessages(prevMessages => [...prevMessages, ...newProactiveMessages]);
          }
          
          if (newRecommendationMessages && newRecommendationMessages.length > 0) {
            log('New recommendation messages found:', newRecommendationMessages.length);
            setMessages(prevMessages => [...prevMessages, ...newRecommendationMessages]);
          }
          
          setLastChecked(new Date());
        } catch (error) {
          console.error('Error checking for new messages:', error);
        }
      }
    };

    // Check every 30 seconds for new messages
    const intervalId = setInterval(checkNewMessages, 30000);
    
    // Initial check when component mounts
    checkNewMessages();

    return () => clearInterval(intervalId);
  }, [isAuthenticated, user, lastChecked]);

  const handleSendMessage = async (message: string) => {
    try {
      if (!message.trim()) return;
      
      // Add user message to the UI
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
        type: 'chat'
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setIsLoading(true);
      
      // Scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      // Get the conversation history in the format expected by the AI service
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      try {
        // Get the user ID and email if authenticated
        const userId = isAuthenticated && user ? user.id : undefined;
        const userEmail = isAuthenticated && user ? user.email : undefined;
        
        log('Sending message with user context:', { userId, userEmail });
        
        // Send to AI service with user context
        const response = await sendAIMessage(message, conversationHistory, userId, userEmail);
        
        // Add AI response to the UI
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          type: 'chat'
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Message sending failed',
          description: error instanceof Error ? error.message : 'Could not get a response from the AI companion',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Error in handleSendMessage:', e);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {message.type === 'recommendation' ? (
              <RecommendationMessage message={message} />
            ) : (
              <Message message={message} isLast={index === messages.length - 1} />
            )}
          </React.Fragment>
        ))}
        {isLoading && <AILoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default AICompanion;
