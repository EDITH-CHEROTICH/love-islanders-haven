
import { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSavePreferences = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a display name",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: displayName.trim(),
          show_age: showAge
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Preferences Updated",
        description: "Your profile display preferences have been saved",
      });
      
      onPreferencesUpdated();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update Failed",
        description: "Failed to save your preferences",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-love flex items-center gap-2">
          <User size={16} />
          Display Preferences
        </h2>
        
        <div className="space-y-4 p-4 bg-island-light/10 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="bg-island-dark border-island-light"
            />
            <p className="text-xs text-muted-foreground">
              This is the name that will be displayed to other users
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <Label htmlFor="show-age">Show Age</Label>
              <p className="text-xs text-muted-foreground">
                {showAge 
                  ? "Your age is visible to other users" 
                  : "Your age is hidden from other users"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-age"
                checked={showAge}
                onCheckedChange={setShowAge}
              />
              {showAge ? (
                <Eye size={16} className="text-muted-foreground" />
              ) : (
                <EyeOff size={16} className="text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleSavePreferences}
        className="w-full bg-love hover:bg-love-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Display Preferences'}
      </Button>
    </div>
  );
};

export default ProfileDisplayPreferences;
