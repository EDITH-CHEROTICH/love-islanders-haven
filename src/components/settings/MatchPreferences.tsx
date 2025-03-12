
import { Heart, User, Ruler } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

const MatchPreferences = () => {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 40]);
  const [distance, setDistance] = useState<number>(50);
  
  return (
    <SettingsSection title="Match Preferences" icon={<Heart size={20} />}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-love">Age Range</h4>
          <div className="py-6 px-2">
            <Slider 
              defaultValue={[ageRange[0], ageRange[1]]} 
              min={18} 
              max={99} 
              step={1}
              onValueChange={(values) => setAgeRange([values[0], values[1]])}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{ageRange[0]} years</span>
              <span>{ageRange[1]} years</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Distance</h4>
          <div className="py-6 px-2">
            <Slider 
              defaultValue={[distance]} 
              min={1} 
              max={100} 
              step={1}
              onValueChange={(values) => setDistance(values[0])}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>1 km</span>
              <span>{distance} km</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-island-light/30">
          <h4 className="text-sm font-medium text-love">Deal-breakers</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="smoking" />
              <Label htmlFor="smoking">Smoking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="children" />
              <Label htmlFor="children">Has children</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pets" />
              <Label htmlFor="pets">Has pets</Label>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default MatchPreferences;
