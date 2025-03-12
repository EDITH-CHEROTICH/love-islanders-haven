
import { Type, Volume2 } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AccessibilitySettings = () => {
  return (
    <SettingsSection title="Accessibility Settings" icon={<Type size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Text Size</h4>
          <div className="py-4 px-2">
            <Slider 
              defaultValue={[2]} 
              min={1} 
              max={5} 
              step={1}
              className="mt-6"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">A</span>
              <span className="text-lg text-muted-foreground">A</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Color Scheme</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High contrast mode</Label>
              <Switch id="high-contrast" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="color-blindness">Color blindness support</Label>
              <Select defaultValue="none">
                <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Voice Assistance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader">Screen reader optimization</Label>
              <Switch id="screen-reader" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-commands">Voice commands</Label>
              <Switch id="voice-commands" />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccessibilitySettings;
