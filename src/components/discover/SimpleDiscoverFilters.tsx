import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface SimpleFilters {
  ageRange: [number, number];
  distance: number;
  gender: 'male' | 'female' | 'any';
}

export const DEFAULT_SIMPLE_FILTERS: SimpleFilters = {
  ageRange: [18, 35],
  distance: 50,
  gender: 'any',
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: SimpleFilters;
  onApply: (filters: SimpleFilters) => void;
}

const SimpleDiscoverFilters: React.FC<Props> = ({ isOpen, onOpenChange, activeFilters, onApply }) => {
  const [draft, setDraft] = useState<SimpleFilters>(activeFilters);

  useEffect(() => { if (isOpen) setDraft(activeFilters); }, [isOpen, activeFilters]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-neutral-900 text-white border-neutral-800">
        <DialogHeader>
          <DialogTitle>Discover Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div>
            <Label className="text-sm text-gray-300">Show me</Label>
            <ToggleGroup
              type="single"
              value={draft.gender}
              onValueChange={(v) => v && setDraft({ ...draft, gender: v as SimpleFilters['gender'] })}
              className="mt-2 justify-start"
            >
              <ToggleGroupItem value="female">Women</ToggleGroupItem>
              <ToggleGroupItem value="male">Men</ToggleGroupItem>
              <ToggleGroupItem value="any">Everyone</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <Label>Age</Label>
              <span>{draft.ageRange[0]} – {draft.ageRange[1]}</span>
            </div>
            <Slider
              min={18} max={80} step={1}
              value={draft.ageRange}
              onValueChange={(v) => setDraft({ ...draft, ageRange: [v[0], v[1]] as [number, number] })}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <Label>Maximum distance</Label>
              <span>{draft.distance} km</span>
            </div>
            <Slider
              min={1} max={200} step={1}
              value={[draft.distance]}
              onValueChange={(v) => setDraft({ ...draft, distance: v[0] })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => { onApply(draft); onOpenChange(false); }} className="w-full bg-love hover:bg-love-dark">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleDiscoverFilters;
