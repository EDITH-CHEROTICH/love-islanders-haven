
import { useState } from 'react';
import { usePrivacy } from './PrivacyContext';
import { Switch } from '@/components/ui/switch';

interface PrivacyToggleProps {
  label: string;
  settingKey: keyof ReturnType<typeof usePrivacy>['settings'];
  icon?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

const PrivacyToggle = ({ label, settingKey, icon, onChange }: PrivacyToggleProps) => {
  const { settings, updatePrivacySetting, isLoading } = usePrivacy();
  const [isToggling, setIsToggling] = useState(false);
  
  const handleToggleChange = async (checked: boolean) => {
    setIsToggling(true);
    
    try {
      // If custom onChange is provided, call it first
      if (onChange) {
        await onChange(checked);
      }
      
      // Update the setting in the context/database
      updatePrivacySetting(settingKey, checked);
    } catch (error) {
      console.error(`Error updating ${settingKey}:`, error);
    } finally {
      setIsToggling(false);
    }
  };
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <Switch
        checked={settings[settingKey] as boolean ?? false}
        onCheckedChange={handleToggleChange}
        disabled={isLoading || isToggling}
      />
    </div>
  );
};

export default PrivacyToggle;
