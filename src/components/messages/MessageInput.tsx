
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Send, Image, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface MessageInputProps {
  onSendMessage: (content: string, contentType: 'text' | 'image' | 'audio', mediaUrl?: string) => Promise<void>;
  isSending: boolean;
  onTypingStatus?: (isTyping: boolean) => void;
  matchId: string;
}

const MessageInput = ({ onSendMessage, isSending, onTypingStatus, matchId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'audio' | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Make sure typing status is set to false when component unmounts
      if (onTypingStatus) {
        onTypingStatus(false);
      }
      
      // Stop any ongoing recording
      stopRecording();
    };
  }, [onTypingStatus]);
  
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
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
  
  const handleFileUpload = async () => {
    if (!selectedFile || !uploadType || !matchId) return;
    
    try {
      // For demo profiles, simulate upload
      if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
        let content = '';
        if (uploadType === 'image') {
          content = 'Sent an image';
        } else if (uploadType === 'audio') {
          content = 'Sent an audio message';
        }
        
        // Create a local object URL for preview
        const localUrl = URL.createObjectURL(selectedFile);
        await onSendMessage(content, uploadType, localUrl);
        
        // Reset state
        setSelectedFile(null);
        setMediaPreview(null);
        setUploadType(null);
        return;
      }
      
      // Real file upload to Supabase
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${matchId}/${uuidv4()}.${fileExt}`;
      const filePath = `messages/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
      
      // Send message with file URL
      let content = '';
      if (uploadType === 'image') {
        content = 'Sent an image';
      } else if (uploadType === 'audio') {
        content = 'Sent an audio message';
      }
      
      await onSendMessage(content, uploadType, publicUrl);
      
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
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        
        setSelectedFile(audioFile);
        setUploadType('audio');
        setMediaPreview('Audio recording');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        description: "Recording started... Press the mic button again to stop.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        description: "Recording stopped",
      });
    }
  };
  
  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const cancelMedia = () => {
    setSelectedFile(null);
    setMediaPreview(null);
    setUploadType(null);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };
  
  return (
    <div className="p-4 border-t border-gray-700/50 bg-island-dark">
      {mediaPreview && (
        <div className="mb-2 bg-island-light/30 p-2 rounded-md relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full" 
            onClick={cancelMedia}
          >
            <X size={14} />
          </Button>
          
          {uploadType === 'image' ? (
            <img src={mediaPreview} alt="Preview" className="h-32 max-w-full rounded-md mx-auto object-contain" />
          ) : (
            <div className="flex items-center space-x-2 text-white py-2">
              <Mic size={18} />
              <span className="text-sm">{mediaPreview}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
          ref={mediaInputRef}
        />
        
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'audio')}
          ref={audioInputRef}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => mediaInputRef.current?.click()}
          className="text-love hover:text-love-light hover:bg-love/10"
          disabled={isSending || isRecording}
        >
          <Image size={20} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRecordToggle}
          className={`${isRecording ? 'bg-red-500/20 text-red-500' : 'text-love hover:text-love-light hover:bg-love/10'}`}
          disabled={isSending}
        >
          <Mic size={20} />
        </Button>
        
        <Input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder={isRecording ? "Recording audio..." : "Type a message..."}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isSending || isRecording}
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
