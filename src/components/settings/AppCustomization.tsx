
import { Paintbrush } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect } from 'react';
import { AppCustomization as AppCustomizationType } from '@/services/settings';

const AppCustomization = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<AppCustomizationType>(
    settings.app_customization
  );

  useEffect(() => {
    setLocalSettings(settings.app_customization);
  }, [settings.app_customization]);

  const handleChange = <K extends keyof AppCustomizationType>(
    key: K, 
    value: AppCustomizationType[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings('app_customization', newSettings);
  };

  return (
    <SettingsSection title="App Customization" icon={<Paintbrush size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Theme</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-selector">App theme</Label>
              <Select 
                value={localSettings.theme ?? 'dark'} 
                onValueChange={(value) => handleChange('theme', value as AppCustomizationType['theme'])}
              >
                <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="auto-theme" className="cursor-pointer">Auto switch with time of day</Label>
                <span className="text-xs text-muted-foreground">Light theme during day, dark at night</span>
              </div>
              <Switch 
                id="auto-theme" 
                checked={localSettings.autoTheme ?? false}
                onCheckedChange={(checked) => handleChange('autoTheme', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Language</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="language-selector">App language</Label>
            <Select 
              value={localSettings.language ?? 'en'} 
              onValueChange={(value) => handleChange('language', value)}
            >
              <SelectTrigger className="w-32 bg-island-light/20 border-island-light">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">App Experience</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="cursor-pointer">Sound effects</Label>
              <Switch 
                id="sound-effects" 
                checked={localSettings.soundEffects ?? true}
                onCheckedChange={(checked) => handleChange('soundEffects', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="haptic-feedback" className="cursor-pointer">Haptic feedback</Label>
              <Switch 
                id="haptic-feedback" 
                checked={localSettings.hapticFeedback ?? true}
                onCheckedChange={(checked) => handleChange('hapticFeedback', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="animations" className="cursor-pointer">Animations</Label>
                <span className="text-xs text-muted-foreground">Enable app animations</span>
              </div>
              <Switch 
                id="animations" 
                checked={localSettings.animations ?? true}
                onCheckedChange={(checked) => handleChange('animations', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AppCustomization;
