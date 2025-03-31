import { useState, useEffect } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSettings } from '@/context/SettingsContext';
import { AccountSettings as AccountSettingsType } from '@/services/settings';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

const AccountSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { user, updatePassword } = useAuth();
  const [localSettings, setLocalSettings] = useState<AccountSettingsType>(
    settings.account_settings
  );
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      toast("Passwords don't match", {
        description: "New password and confirmation must match",
        duration: 3000
      });
      return;
    }
    if (newPassword.length < 8) {
      toast("Password too short", {
        description: "Password must be at least 8 characters",
        duration: 3000
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      // Use the updatePassword from auth context
      await updatePassword(newPassword);
      
      toast("Password updated", {
        description: "Your password has been updated successfully",
        duration: 3000
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast("Password update failed", {
        description: error.message || "There was a problem updating your password",
        duration: 5000,
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsUpdatingPassword(false);
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
              disabled={user?.email !== undefined} // Disable if it's from Supabase auth
            />
            {user?.email && (
              <p className="text-xs text-muted-foreground mt-1">
                This email is verified and cannot be changed.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Password</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-island-light/20 border-island-light mt-1 pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-island-light/20 border-island-light mt-1 pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-island-light/20 border-island-light mt-1 pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button 
              onClick={handlePasswordSave} 
              className="w-full"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccountSettings;
