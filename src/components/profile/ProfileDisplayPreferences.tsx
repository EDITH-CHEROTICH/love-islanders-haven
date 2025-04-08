
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      // First check authentication
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to update your preferences',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }
      
      const userId = authData.session.user.id;
      
      // Update profile preferences
      const { error } = await supabase
        .from('profiles')
        .update({
          name: displayName,
          show_age: showAge
        })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }
      
      toast({
        title: 'Preferences updated',
        description: 'Your display preferences have been saved'
      });
      
      // Notify parent component
      onPreferencesUpdated();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem saving your preferences',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-love">Display Preferences</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-island-dark border-island-light"
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
        onClick={handleSavePreferences} 
        disabled={isSaving}
        className="w-full mt-4"
      >
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
};

export default ProfileDisplayPreferences;
