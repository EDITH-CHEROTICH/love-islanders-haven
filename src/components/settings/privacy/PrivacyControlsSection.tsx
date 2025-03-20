
import { Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePrivacy } from './PrivacyContext';
import { PrivacySettings } from '@/services/settings/types';

interface PrivacyControlSectionProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PrivacyControlsSection = ({ 
  title,
  icon = <Shield size={16} className="text-muted-foreground" />,
  className = "",
  children
}: PrivacyControlSectionProps) => {
  return (
    <div className={`space-y-4 pt-4 border-t border-island-light/30 ${className}`}>
      <h4 className="text-sm font-medium text-love flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export const PrivacyToggle = ({ 
  label, 
  settingKey,
  icon
}: { 
  label: string; 
  settingKey: keyof PrivacySettings;
  icon?: React.ReactNode;
}) => {
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

export default PrivacyControlsSection;
