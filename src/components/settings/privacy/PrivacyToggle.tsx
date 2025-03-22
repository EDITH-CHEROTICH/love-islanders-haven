
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePrivacy } from './PrivacyContext';
import { PrivacySettings } from '@/services/settings/types';

interface PrivacyToggleProps { 
  label: string; 
  settingKey: keyof PrivacySettings;
  icon?: React.ReactNode;
}

const PrivacyToggle = ({ 
  label, 
  settingKey,
  icon
}: PrivacyToggleProps) => {
  const { settings, updatePrivacySetting } = usePrivacy();
  
  // Check if the setting is a boolean type
  if (typeof settings[settingKey] !== 'boolean') {
    console.error(`Setting ${String(settingKey)} is not a boolean value`);
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <Label htmlFor={`setting-${String(settingKey)}`} className="cursor-pointer">{label}</Label>
      </div>
      <Switch 
        id={`setting-${String(settingKey)}`} 
        checked={settings[settingKey] as boolean}
        onCheckedChange={(checked) => updatePrivacySetting(settingKey, checked)}
      />
    </div>
  );
};

export default PrivacyToggle;
