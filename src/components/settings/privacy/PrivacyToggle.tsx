
import { Switch } from '@/components/ui/switch';
import { usePrivacy } from './PrivacyContext';
import { PrivacySettings } from '@/services/settings';
import { LucideIcon } from 'lucide-react';

interface PrivacyToggleProps {
  label: string;
  settingKey: keyof PrivacySettings;
  icon?: React.ReactNode;
  description?: string;
}

const PrivacyToggle = ({
  label,
  settingKey,
  icon,
  description
}: PrivacyToggleProps) => {
  const { settings, updatePrivacySetting } = usePrivacy();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-2">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div>
          <div className="font-medium">{label}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Switch
        checked={settings[settingKey] as boolean ?? false}
        onCheckedChange={(checked) => updatePrivacySetting(settingKey, checked)}
      />
    </div>
  );
};

export default PrivacyToggle;
