
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import SafetyContactForm from './SafetyContactForm';
import SafetyContactSelect from './SafetyContactSelect';

interface DatePlanFormProps {
  matchName: string;
}

const DatePlanForm = ({ matchName }: DatePlanFormProps) => {
  const { addDatePlan, isLoading } = useDatingSafety();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [shareLocation, setShareLocation] = useState(false);
  
  const handleScheduleDate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !location) {
      return;
    }
    
    await addDatePlan({
      location,
      date_time: date.toISOString(),
      notes: notes || undefined,
      contact_id: selectedContactId || undefined,
      location_sharing_enabled: shareLocation
    });
    
    // Reset form
    setDate(undefined);
    setLocation('');
    setNotes('');
    setSelectedContactId('');
    setShareLocation(false);
  };
  
  return (
    <form onSubmit={handleScheduleDate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Meeting location</Label>
        <Input
          id="location"
          placeholder="Enter the meeting location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Date and time</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about your date plan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="safety-contact">Safety contact</Label>
        <SafetyContactSelect 
          selectedContactId={selectedContactId}
          setSelectedContactId={setSelectedContactId}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="location-sharing" 
          checked={shareLocation} 
          onCheckedChange={setShareLocation} 
        />
        <Label htmlFor="location-sharing">Share my location during the date</Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={!date || !location || isLoading}
      >
        Schedule Safe Date with {matchName}
      </Button>
    </form>
  );
};

export default DatePlanForm;
