
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSafetyContacts } from '@/hooks/safety/use-safety-contacts';
import { useDatePlans } from '@/hooks/safety/use-date-plans';
import { useToast } from '@/hooks/use-toast';

interface DatePlanDialogProps {
  onDatePlanCreated: (dateMessage: string) => Promise<void>;
}

const DatePlanDialog = ({ onDatePlanCreated }: DatePlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { safetyContacts } = useSafetyContacts();
  const { addDatePlan } = useDatePlans();
  
  const [datePlan, setDatePlan] = useState({
    location: '',
    date_time: '',
    notes: '',
    contact_id: '',
    location_sharing_enabled: true
  });
  
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
      setOpen(false);
      
      // Create a message about the date plan if successful
      const dateTime = new Date(datePlan.date_time);
      const formattedDate = dateTime.toLocaleDateString();
      const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const dateMessage = `Let's meet at ${datePlan.location} on ${formattedDate} at ${formattedTime}.`;
      await onDatePlanCreated(dateMessage);
      
      // Reset form
      setDatePlan({
        location: '',
        date_time: '',
        notes: '',
        contact_id: '',
        location_sharing_enabled: true
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePlanDate}>
            Create Date Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatePlanDialog;
