import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import { useMatchMessages } from '@/hooks/use-match-messages';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import { MapPin, Shield, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Messages = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [datePlanDialogOpen, setDatePlanDialogOpen] = useState(false);
  const [datePlan, setDatePlan] = useState({
    location: '',
    date_time: '',
    notes: '',
    contact_id: '',
    location_sharing_enabled: true
  });
  
  const { 
    safetyContacts, 
    isLoading: safetyLoading, 
    fetchSafetyContacts,
    addDatePlan
  } = useDatingSafety();
  
  useEffect(() => {
    fetchSafetyContacts();
  }, []);
  
  useEffect(() => {
    // Fetch current user ID on component mount
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    if (!matchId) {
      navigate('/matches');
    }
  }, [matchId, navigate]);
  
  // Set up realtime presence for typing indicator
  useEffect(() => {
    if (!matchId || !currentUserId) return;
    
    // Create a channel for this match
    const presenceChannel = supabase.channel(`match:${matchId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });
    
    // Handle presence state changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'join' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'leave' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .subscribe();
      
    setChannel(presenceChannel);
    
    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [matchId, currentUserId]);
  
  // Function to update typing status based on presence state
  const updateTypingStatus = (state: any) => {
    if (!currentUserId) return;
    
    // Check if any other user is typing
    let someoneIsTyping = false;
    Object.keys(state).forEach(presenceId => {
      if (presenceId !== currentUserId) {
        state[presenceId].forEach((presence: any) => {
          if (presence.isTyping) {
            someoneIsTyping = true;
          }
        });
      }
    });
    
    setIsTyping(someoneIsTyping);
  };
  
  const { messages, isLoading, matchInfo } = useMatchMessages(matchId, currentUserId);
  
  const handleSendMessage = async (content: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      await sendMessage(matchId, content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleTypingStatus = async (isTyping: boolean) => {
    if (channel) {
      await channel.track({
        isTyping,
        user_id: currentUserId,
        timestamp: new Date().toISOString(),
      });
    }
  };
  
  const handleBackClick = () => {
    navigate('/matches');
  };
  
  const handlePlanDate = async () => {
    if (!datePlan.location || !datePlan.date_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addDatePlan(datePlan);
    
    if (result) {
      setDatePlanDialogOpen(false);
      
      // Send a message about the date plan if successful
      const dateTime = new Date(datePlan.date_time);
      const formattedDate = dateTime.toLocaleDateString();
      const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const dateMessage = `Let's meet at ${datePlan.location} on ${formattedDate} at ${formattedTime}.`;
      await handleSendMessage(dateMessage);
    }
  };
  
  const calendarAction = (
    <Dialog open={datePlanDialogOpen} onOpenChange={setDatePlanDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan a Date</DialogTitle>
          <DialogDescription>
            Set up a date and optionally enable safety features
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter meeting location"
              className="col-span-3"
              value={datePlan.location}
              onChange={(e) => setDatePlan({...datePlan, location: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date & Time
            </Label>
            <Input
              id="date"
              type="datetime-local"
              className="col-span-3"
              value={datePlan.date_time}
              onChange={(e) => setDatePlan({...datePlan, date_time: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details"
              className="col-span-3"
              value={datePlan.notes}
              onChange={(e) => setDatePlan({...datePlan, notes: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="safety-contact" className="text-right">
              Safety Contact
            </Label>
            <Select 
              value={datePlan.contact_id} 
              onValueChange={(value) => setDatePlan({...datePlan, contact_id: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a safety contact" />
              </SelectTrigger>
              <SelectContent>
                {safetyContacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name}
                  </SelectItem>
                ))}
                {safetyContacts.length === 0 && (
                  <SelectItem value="" disabled>
                    No safety contacts added yet
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location-sharing" className="text-right">
              Location Sharing
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="location-sharing"
                checked={datePlan.location_sharing_enabled}
                onCheckedChange={(checked) => 
                  setDatePlan({...datePlan, location_sharing_enabled: checked})
                }
              />
              <Label htmlFor="location-sharing">
                Share location during date
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDatePlanDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePlanDate}>
            Create Date Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <MessageHeader 
          matchInfo={matchInfo} 
          onBackClick={handleBackClick} 
          actions={calendarAction}
        />
        
        <main className="flex flex-col h-[calc(100vh-180px)]">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
            currentUserId={currentUserId} 
            isTyping={isTyping}
          />
          
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isSending={isSending}
            onTypingStatus={handleTypingStatus}
          />
        </main>
      </div>
    </div>
  );
};

export default Messages;
