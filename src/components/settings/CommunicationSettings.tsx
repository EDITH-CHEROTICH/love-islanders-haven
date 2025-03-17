
import { MessageSquare } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/SettingsContext';
import { useEffect, useState } from 'react';
import { CommunicationSettings as CommunicationSettingsType } from '@/services/settings';
import { toast } from 'sonner';

const CommunicationSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<CommunicationSettingsType>(
    settings.communication_settings
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalSettings(settings.communication_settings);
  }, [settings.communication_settings]);

  const handleChange = async (key: keyof CommunicationSettingsType, value: boolean) => {
    try {
      setIsUpdating(true);
      const newSettings = { ...localSettings, [key]: value };
      setLocalSettings(newSettings);
      
      const success = await updateSettings('communication_settings', newSettings);
      if (!success) {
        toast.error('Failed to update communication settings');
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      toast.error('Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingsSection title="Communication Settings" icon={<MessageSquare size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Messaging</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="read-receipts" className="cursor-pointer">Show read receipts</Label>
              <Switch 
                id="read-receipts" 
                checked={localSettings.readReceipts ?? true}
                disabled={isUpdating}
                onCheckedChange={(checked) => handleChange('readReceipts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typing-indicators" className="cursor-pointer">Show typing indicators</Label>
              <Switch 
                id="typing-indicators" 
                checked={localSettings.typingIndicators ?? true}
                disabled={isUpdating}
                onCheckedChange={(checked) => handleChange('typingIndicators', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Message Filters</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="filter-offensive" className="cursor-pointer">Filter offensive content</Label>
                <span className="text-xs text-muted-foreground">Block messages with potentially offensive content</span>
              </div>
              <Switch 
                id="filter-offensive" 
                checked={localSettings.filterOffensive ?? true}
                disabled={isUpdating}
                onCheckedChange={(checked) => handleChange('filterOffensive', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="filter-spam" className="cursor-pointer">Spam protection</Label>
                <span className="text-xs text-muted-foreground">Block suspicious messages and spam</span>
              </div>
              <Switch 
                id="filter-spam" 
                checked={localSettings.filterSpam ?? true}
                disabled={isUpdating}
                onCheckedChange={(checked) => handleChange('filterSpam', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default CommunicationSettings;
