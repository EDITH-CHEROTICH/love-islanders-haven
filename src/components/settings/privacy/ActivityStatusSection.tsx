
import { Activity } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PrivacySettings } from '@/services/settings';

interface ActivityStatusSectionProps {
  settings: PrivacySettings;
  onChange: <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => void;
}

const ActivityStatusSection = ({ settings, onChange }: ActivityStatusSectionProps) => {
  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Activity Status</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" />
            <Label htmlFor="share-activity" className="cursor-pointer">Share your activity status</Label>
          </div>
          <Switch 
            id="share-activity" 
            checked={settings.shareActivityStatus ?? true}
            onCheckedChange={(checked) => onChange('shareActivityStatus', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" />
            <Label htmlFor="last-active" className="cursor-pointer">Show when you were last active</Label>
          </div>
          <Switch 
            id="last-active" 
            checked={settings.lastActiveVisibility ?? true}
            onCheckedChange={(checked) => onChange('lastActiveVisibility', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityStatusSection;
