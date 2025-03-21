
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface DurationSelectorProps {
  duration: number;
  onDurationChange: (value: number[]) => void;
  disabled?: boolean;
}

const DurationSelector = ({
  duration,
  onDurationChange,
  disabled = false
}: DurationSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Streak Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
      </label>
      <Slider 
        defaultValue={[24]} 
        value={[duration]}
        max={24} 
        min={1} 
        step={1} 
        onValueChange={onDurationChange}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        Your streak will expire after {duration} {duration === 1 ? 'hour' : 'hours'} if not renewed.
      </p>
    </div>
  );
};

export default DurationSelector;
