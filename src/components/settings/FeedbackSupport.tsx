
import { MessageSquareText, HelpCircle } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FeedbackSupport = () => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback before submitting');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to submit feedback');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          feedback: feedback.trim(),
          category: category
        });
        
      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewFeedback = () => {
    window.location.href = '/feedback';
  };
  
  const handleContactSupport = () => {
    toast.info('Support will be available in a future update.');
  };
  
  return (
    <SettingsSection title="Feedback & Support" icon={<MessageSquareText size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Share Your Feedback</h4>
          <div className="space-y-3">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-island-light/20 border-island-light">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="ui">User Interface</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Label htmlFor="feedback">Tell us what you think</Label>
            <Textarea 
              id="feedback" 
              placeholder="Your feedback helps us improve the app..."
              className="bg-island-light/20 border-island-light"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button 
              onClick={handleSendFeedback} 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Help & Support</h4>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full bg-island-light/10 border-island-light/40" 
              onClick={handleContactSupport}
            >
              <HelpCircle size={16} className="mr-2" />
              Contact Support
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full bg-island-light/10 border-island-light/40" 
              onClick={handleViewFeedback}
            >
              <MessageSquareText size={16} className="mr-2" />
              View Feedback
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default FeedbackSupport;
