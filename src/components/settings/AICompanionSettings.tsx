
import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
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
import { useSettings } from '@/context/SettingsContext';
import { AICompanionSettings as AICompanionSettingsType } from '@/services/settings';

const AICompanionSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<AICompanionSettingsType>(
    settings.ai_companion_settings
  );

  useEffect(() => {
    setLocalSettings(settings.ai_companion_settings);
  }, [settings.ai_companion_settings]);

  const handleChange = <K extends keyof AICompanionSettingsType>(
    key: K, 
    value: AICompanionSettingsType[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings('ai_companion_settings', newSettings);
  };

  const handleResetPersonality = () => {
    const defaultSettings: AICompanionSettingsType = {
      conversationStyle: 'caring',
      voiceTone: 'warm',
      allowProactiveMessages: true,
      messageFrequency: 3
    };
    
    setLocalSettings(defaultSettings);
    updateSettings('ai_companion_settings', defaultSettings);
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
              <Select 
                value={localSettings.conversationStyle ?? 'caring'}
                onValueChange={(value) => handleChange('conversationStyle', value as AICompanionSettingsType['conversationStyle'])}
              >
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
              <Select 
                value={localSettings.voiceTone ?? 'warm'}
                onValueChange={(value) => handleChange('voiceTone', value as AICompanionSettingsType['voiceTone'])}
              >
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
              <Switch 
                id="companion-initiative" 
                checked={localSettings.allowProactiveMessages ?? true}
                onCheckedChange={(checked) => handleChange('allowProactiveMessages', checked)}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Daily message frequency</Label>
              <div className="py-4 px-2">
                <Slider 
                  value={[localSettings.messageFrequency ?? 3]} 
                  min={1} 
                  max={10} 
                  step={1}
                  onValueChange={(values) => handleChange('messageFrequency', values[0])}
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
