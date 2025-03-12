
import { Bot, Clock } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AICompanionSettings = () => {
  const handleResetPersonality = () => {
    toast.success('AI personality has been reset to default');
  };
  
  return (
    <SettingsSection title="AI Companion Settings" icon={<Bot size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Personality Traits</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="companion-style">Conversation Style</Label>
              <Select defaultValue="caring">
                <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="caring">Caring</SelectItem>
                  <SelectItem value="thoughtful">Thoughtful</SelectItem>
                  <SelectItem value="flirty">Flirty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="companion-voice">Voice Tone</Label>
              <Select defaultValue="warm">
                <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="confident">Confident</SelectItem>
                  <SelectItem value="soothing">Soothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Interaction Frequency</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="companion-initiative" className="cursor-pointer">Allow proactive messages</Label>
              <Switch id="companion-initiative" defaultChecked />
            </div>
            
            <div>
              <Label className="mb-2 block">Daily message frequency</Label>
              <div className="py-4 px-2">
                <Slider 
                  defaultValue={[3]} 
                  min={1} 
                  max={10} 
                  step={1}
                  className="mt-6"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Less</span>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-island-light/30">
          <Button variant="outline" className="w-full" onClick={handleResetPersonality}>
            Reset to Default Personality
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AICompanionSettings;
