
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { updateDisplayPreferences } from '@/services/profiles/profile-update';
import { useToast } from '@/hooks/use-toast';

interface ProfileDisplayPreferencesProps {
  initialDisplayName: string;
  initialShowAge: boolean;
  onPreferencesUpdated: () => void;
}

const ProfileDisplayPreferences = ({ 
  initialDisplayName,
  initialShowAge,
  onPreferencesUpdated
}: ProfileDisplayPreferencesProps) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [showAge, setShowAge] = useState(initialShowAge);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSavePreferences = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a display name.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDisplayPreferences(displayName, showAge);
      
      toast({
        title: "Preferences Saved",
        description: "Your display preferences have been updated.",
      });
      
      // Notify parent component that preferences have been updated
      onPreferencesUpdated();
    } catch (error) {
      console.error('Error saving display preferences:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-white">Display Preferences</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            className="bg-island-dark border-island-light text-white"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-age" className="flex-1">Show age on profile</Label>
          <Switch
            id="show-age"
            checked={showAge}
            onCheckedChange={setShowAge}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSavePreferences}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
};

export default ProfileDisplayPreferences;
