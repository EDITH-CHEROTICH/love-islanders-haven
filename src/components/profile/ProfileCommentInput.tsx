
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ProfileCommentInputProps {
  onClose: () => void;
}

const ProfileCommentInput = ({ onClose }: ProfileCommentInputProps) => {
  const [comment, setComment] = useState('');

  const handleSendComment = () => {
    if (comment.trim()) {
      toast.success("Comment sent!");
      setComment('');
      onClose();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md">
      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 rounded-full bg-white/20 text-white placeholder:text-white/50 focus:outline-none"
        />
        <button 
          onClick={handleSendComment}
          className="bg-love hover:bg-love-dark text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ProfileCommentInput;
