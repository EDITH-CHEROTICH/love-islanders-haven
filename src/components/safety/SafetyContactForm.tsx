
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDatingSafety } from '@/hooks/use-dating-safety';

interface SafetyContactFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const SafetyContactForm = ({ onCancel, onSuccess }: SafetyContactFormProps) => {
  const { addSafetyContact, isLoading } = useDatingSafety();
  
  const [newContact, setNewContact] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  
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
      onSuccess();
    }
  };
  
  return (
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
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SafetyContactForm;
