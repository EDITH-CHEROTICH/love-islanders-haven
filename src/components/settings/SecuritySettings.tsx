
import { useState, useEffect } from 'react';
import { KeyRound, Laptop } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSettings } from '@/context/SettingsContext';
import { SecuritySettings as SecuritySettingsType } from '@/services/settings';

const SecuritySettings = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SecuritySettingsType>(
    settings.security_settings
  );

  useEffect(() => {
    setLocalSettings(settings.security_settings);
  }, [settings.security_settings]);

  const handleChange = <K extends keyof SecuritySettingsType>(
    key: K, 
    value: SecuritySettingsType[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings('security_settings', newSettings);
  };

  const handleEnableTwoFactor = () => {
    toast.info('Two-factor authentication setup will be available in a future update.');
  };
  
  const handleManageSessions = () => {
    toast.info('Session management will be available in a future update.');
  };
  
  return (
    <SettingsSection title="Security Settings" icon={<KeyRound size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Two-Factor Authentication</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="two-factor" className="cursor-pointer">Enable 2FA</Label>
                <span className="text-xs text-muted-foreground">Add an extra layer of security to your account</span>
              </div>
              <Switch 
                id="two-factor" 
                checked={localSettings.twoFactor ?? false}
                onCheckedChange={(checked) => handleChange('twoFactor', checked)}
              />
            </div>
            <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40" onClick={handleEnableTwoFactor}>
              Set Up Two-Factor Authentication
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Login Security</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="biometric" className="cursor-pointer">Biometric login</Label>
                <span className="text-xs text-muted-foreground">Use fingerprint or face recognition</span>
              </div>
              <Switch 
                id="biometric" 
                checked={localSettings.biometric ?? false}
                onCheckedChange={(checked) => handleChange('biometric', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="login-notification" className="cursor-pointer">Login notifications</Label>
                <span className="text-xs text-muted-foreground">Get notified of new login attempts</span>
              </div>
              <Switch 
                id="login-notification" 
                checked={localSettings.loginNotification ?? true}
                onCheckedChange={(checked) => handleChange('loginNotification', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Session Management</h4>
          <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40" onClick={handleManageSessions}>
            <Laptop size={16} className="mr-2" />
            Manage Active Sessions
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default SecuritySettings;
