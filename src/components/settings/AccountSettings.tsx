
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/SettingsContext';
import { AccountSettings as AccountSettingsType } from '@/services/settings';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AccountSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [localSettings, setLocalSettings] = useState<AccountSettingsType>(
    settings.account_settings
  );
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalSettings(settings.account_settings);
    loadUserEmail();
  }, [settings.account_settings, user]);

  const loadUserEmail = async () => {
    // Try different sources for the email
    let userEmail = '';
    
    // 1. Try from user object
    if (user?.email) {
      userEmail = user.email;
      console.log("User email set from auth context:", userEmail);
    } 
    // 2. Try from localStorage
    else {
      const authContact = localStorage.getItem('authContact');
      if (authContact) {
        userEmail = authContact;
        console.log("User email set from localStorage:", userEmail);
      }
    }
    
    // 3. Try from Supabase directly
    if (!userEmail) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          userEmail = user.email;
          console.log("User email set from Supabase auth:", userEmail);
        }
      } catch (error) {
        console.error("Error fetching user from Supabase:", error);
      }
    }
    
    // 4. If we found an email, update state and settings
    if (userEmail) {
      setEmail(userEmail);
      
      // Update settings if the email changed
      if (localSettings.email !== userEmail) {
        const newSettings = { ...localSettings, email: userEmail };
        setLocalSettings(newSettings);
        updateSettings('account_settings', newSettings).catch(error => {
          console.error('Error updating email in settings:', error);
        });
        
        // Also ensure it's in localStorage
        localStorage.setItem('authContact', userEmail);
      }
    }
    
    // Try to fetch user profile from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (profile) {
          console.log("Retrieved profile:", profile);
        }
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
    }
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Only update if this is not a Supabase authenticated email
    if (!user?.email) {
      setIsLoading(true);
      try {
        // Update local settings
        const newSettings = { ...localSettings, email: newEmail };
        setLocalSettings(newSettings);
        
        // Update settings in context/database
        await updateSettings('account_settings', newSettings);
        
        // Also update localStorage
        localStorage.setItem('authContact', newEmail);
        
        toast.success("Email updated successfully");
      } catch (error) {
        console.error('Error updating email:', error);
        toast.error("Failed to update email");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SettingsSection title="Account Settings" icon={<User size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Email Address</h4>
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="bg-island-light/20 border-island-light"
              disabled={user?.email !== undefined || isLoading} // Disable if it's from Supabase auth or loading
            />
            {user?.email && (
              <p className="text-xs text-muted-foreground mt-1">
                This email is verified and cannot be changed.
              </p>
            )}
            {!user?.email && (
              <p className="text-xs text-muted-foreground mt-1">
                You can update your email address here.
              </p>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccountSettings;
