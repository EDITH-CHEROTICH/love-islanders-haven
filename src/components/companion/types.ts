
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'chat' | 'recommendation' | 'proactive';
};

// Adding MessageType to align with InlineChatContainer's usage
export type MessageType = ChatMessage;
