import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useDatingSafety, type SafetyContact, type DatePlan } from '@/hooks/use-dating-safety';

interface DateSafetyProps {
  matchId: string;
  matchName: string;
}

const DateSafety = ({ matchId, matchName }: DateSafetyProps) => {
  const { 
    safetyContacts, 
    addSafetyContact, 
    addDatePlan, 
    isLoading 
  } = useDatingSafety();
  
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [shareLocation, setShareLocation] = useState(false);
  
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name || !newContact.phone_number) {
      return;
    }
    
    const result = await addSafetyContact({
      name: newContact.name,
      phone_number: newContact.phone_number,
      email: newContact.email || undefined
    });
    
    if (result) {
      setNewContact({ name: '', phone_number: '', email: '' });
      setShowAddContact(false);
    }
  };
  
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
    <Card className="bg-background/80 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-love" />
          Dating Safety Features
        </CardTitle>
        <CardDescription>
          Plan safe dates and share your plans with trusted contacts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
            
            {safetyContacts.length > 0 ? (
              <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                <SelectTrigger id="safety-contact">
                  <SelectValue placeholder="Select a safety contact" />
                </SelectTrigger>
                <SelectContent>
                  {safetyContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div>
                {!showAddContact ? (
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAddContact(true)}
                  >
                    Add a safety contact
                  </Button>
                ) : (
                  <div className="space-y-2 p-2 border rounded-md">
                    <div>
                      <Label htmlFor="contact-name">Name</Label>
                      <Input 
                        id="contact-name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone number</Label>
                      <Input 
                        id="contact-phone"
                        value={newContact.phone_number}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone_number: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email (optional)</Label>
                      <Input 
                        id="contact-email"
                        value={newContact.email}
                        onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email address"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        onClick={handleAddContact}
                        disabled={!newContact.name || !newContact.phone_number || isLoading}
                      >
                        Save Contact
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAddContact(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
          <div>
            Your safety is our priority. We'll send you reminders before your date 
            and check in with you during and after your date.
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DateSafety;
