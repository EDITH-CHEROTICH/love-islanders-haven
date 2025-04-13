
import { useState } from 'react';
import { updateDisplayPreferences } from '@/services/profiles/profile-update';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a display name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Call the update service with the new values
      const result = await updateDisplayPreferences(displayName, showAge);
      
      toast({
        title: "Preferences Saved",
        description: "Your display preferences have been updated",
      });
      
      // Notify parent component that preferences were updated
      onPreferencesUpdated();
    } catch (error: any) {
      console.error('Error saving display preferences:', error);
      
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save your preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Display Preferences</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-island-light/20 border-island-light"
            placeholder="Your display name"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showAge" className="text-sm">Show Age on Profile</Label>
          <Switch
            id="showAge"
            checked={showAge}
            onCheckedChange={setShowAge}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-love hover:bg-love-dark"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : "Save Display Preferences"}
      </Button>
    </div>
  );
};

export default ProfileDisplayPreferences;
