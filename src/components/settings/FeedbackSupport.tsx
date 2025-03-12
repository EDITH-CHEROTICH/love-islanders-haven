
import { MessageSquareText, HelpCircle } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';

const FeedbackSupport = () => {
  const [feedback, setFeedback] = useState('');
  
  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback before submitting');
      return;
    }
    
    toast.success('Thank you for your feedback!');
    setFeedback('');
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
            <Label htmlFor="feedback">Tell us what you think</Label>
            <Textarea 
              id="feedback" 
              placeholder="Your feedback helps us improve the app..."
              className="bg-island-light/20 border-island-light"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={handleSendFeedback} className="w-full">Send Feedback</Button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Help & Support</h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40" onClick={handleContactSupport}>
              <HelpCircle size={16} className="mr-2" />
              Contact Support
            </Button>
            
            <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40" onClick={handleContactSupport}>
              <HelpCircle size={16} className="mr-2" />
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default FeedbackSupport;
