
import { MessageSquare, Shield } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const CommunicationSettings = () => {
  return (
    <SettingsSection title="Communication Settings" icon={<MessageSquare size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Messaging</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="read-receipts" className="cursor-pointer">Show read receipts</Label>
              <Switch id="read-receipts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typing-indicators" className="cursor-pointer">Show typing indicators</Label>
              <Switch id="typing-indicators" defaultChecked />
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
              <Switch id="filter-offensive" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="filter-spam" className="cursor-pointer">Spam protection</Label>
                <span className="text-xs text-muted-foreground">Block suspicious messages and spam</span>
              </div>
              <Switch id="filter-spam" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default CommunicationSettings;
