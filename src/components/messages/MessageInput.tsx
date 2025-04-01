
import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadMessageFile } from '@/services/messages/fileUpload';
import MediaPreview from './MediaPreview';
import AudioRecorder from './AudioRecorder';
import MediaUploadButton from './MediaUploadButton';

interface MessageInputProps {
  onSendMessage: (content: string, contentType: 'text' | 'image' | 'audio', mediaUrl?: string) => Promise<void>;
  isSending: boolean;
  onTypingStatus?: (isTyping: boolean) => void;
  matchId: string;
}

const MessageInput = ({ onSendMessage, isSending, onTypingStatus, matchId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'audio' | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Handle typing notification
  const handleTyping = () => {
    if (onTypingStatus) {
      // User is typing
      onTypingStatus(true);
      
      // Clear previous timeout if it exists
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout to stop "typing" status after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStatus(false);
      }, 2000);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Make sure typing status is set to false when component unmounts
      if (onTypingStatus) {
        onTypingStatus(false);
      }
    };
  }, [onTypingStatus]);
  
  // Handle sending text messages
  const handleSendMessage = async () => {
    if (isSending) return;
    
    try {
      if (selectedFile && uploadType) {
        await handleFileUpload();
      } else if (newMessage.trim()) {
        await onSendMessage(newMessage.trim(), 'text');
        setNewMessage('');
      }
      
      // Set typing status to false after sending a message
      if (onTypingStatus) {
        onTypingStatus(false);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };
  
  // Handle file uploads
  const handleFileUpload = async () => {
    if (!selectedFile || !uploadType || !matchId) return;
    
    try {
      // Get media URL (local URL for demo profiles or Supabase URL for real users)
      const mediaUrl = await uploadMessageFile(matchId, selectedFile, uploadType);
      
      // Send message with file URL
      let content = '';
      if (uploadType === 'image') {
        content = 'Sent an image';
      } else if (uploadType === 'audio') {
        content = 'Sent an audio message';
      }
      
      await onSendMessage(content, uploadType, mediaUrl);
      
      // Reset state
      setSelectedFile(null);
      setMediaPreview(null);
      setUploadType(null);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };
  
  // Handle file selection
  const handleFileSelected = (file: File, type: 'image' | 'audio') => {
    setUploadType(type);
    setSelectedFile(file);
    
    // Create preview for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === 'audio') {
      // For audio files, we can show the filename as preview
      setMediaPreview(file.name);
    }
  };
  
  // Handle audio recording completion
  const handleRecordingComplete = (audioFile: File) => {
    setSelectedFile(audioFile);
    setUploadType('audio');
    setMediaPreview('Audio recording');
  };
  
  // Clear media preview
  const cancelMedia = () => {
    setSelectedFile(null);
    setMediaPreview(null);
    setUploadType(null);
  };
  
  return (
    <div className="p-4 border-t border-gray-700/50 bg-island-dark">
      <MediaPreview 
        mediaPreview={mediaPreview} 
        uploadType={uploadType} 
        onCancel={cancelMedia} 
      />
      
      <div className="flex items-center gap-2">
        <MediaUploadButton 
          onFileSelected={handleFileSelected} 
          type="image" 
          disabled={isSending} 
        />
        
        <AudioRecorder 
          isSending={isSending} 
          onRecordingComplete={handleRecordingComplete} 
        />
        
        <Input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isSending}
        />
        
        <Button 
          onClick={handleSendMessage} 
          disabled={((!newMessage.trim() && !selectedFile) || isSending)}
          className="bg-love hover:bg-love/90"
          aria-label="Send message"
        >
          {isSending ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
