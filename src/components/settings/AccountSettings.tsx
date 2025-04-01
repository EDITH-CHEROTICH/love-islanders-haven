
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/SettingsContext';
import { AccountSettings as AccountSettingsType } from '@/services/settings';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

const AccountSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [localSettings, setLocalSettings] = useState<AccountSettingsType>(
    settings.account_settings
  );
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    setLocalSettings(settings.account_settings);
    
    // Make sure we update the email field when user data is available
    if (user?.email) {
      setEmail(user.email);
      console.log("User email set in AccountSettings:", user.email);
    } else {
      // If user email is not in the auth context, try to get it from localStorage
      const authContact = localStorage.getItem('authContact');
      if (authContact) {
        setEmail(authContact);
        console.log("User email set from localStorage:", authContact);
        
        // Also try to update settings with this email
        const newSettings = { ...localSettings, email: authContact };
        setLocalSettings(newSettings);
        updateSettings('account_settings', newSettings).catch(error => {
          console.error('Error updating email in settings:', error);
        });
      }
    }

    // Try to fetch user profile from Supabase
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Retrieved user from Supabase:", user);
          if (user.email) {
            setEmail(user.email);
          }

          // Also try to get profile data
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
        console.error("Error getting user:", error);
      }
    };

    fetchUserProfile();
  }, [settings.account_settings, user]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Auto-save email when changed
    const newSettings = { ...localSettings, email: e.target.value };
    setLocalSettings(newSettings);
    updateSettings('account_settings', newSettings)
      .then(() => {
        localStorage.setItem('authContact', e.target.value);
      })
      .catch(error => {
        console.error('Error updating email:', error);
      });
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
              disabled={user?.email !== undefined} // Disable if it's from Supabase auth
            />
            {user?.email && (
              <p className="text-xs text-muted-foreground mt-1">
                This email is verified and cannot be changed.
              </p>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccountSettings;
