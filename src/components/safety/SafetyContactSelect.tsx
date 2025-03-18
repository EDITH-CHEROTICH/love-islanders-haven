
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import SafetyContactForm from './SafetyContactForm';

interface SafetyContactSelectProps {
  selectedContactId: string;
  setSelectedContactId: (id: string) => void;
}

const SafetyContactSelect = ({ selectedContactId, setSelectedContactId }: SafetyContactSelectProps) => {
  const { safetyContacts } = useDatingSafety();
  const [showAddContact, setShowAddContact] = useState(false);
  
  // If we have contacts, show the select dropdown
  if (safetyContacts.length > 0) {
    return (
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
    );
  }
  
  // If no contacts, show button to add one
  return (
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
        <SafetyContactForm 
          onCancel={() => setShowAddContact(false)} 
          onSuccess={() => setShowAddContact(false)}
        />
      )}
    </div>
  );
};

export default SafetyContactSelect;
