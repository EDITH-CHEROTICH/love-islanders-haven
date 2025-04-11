
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AdvancedFilters, { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';

interface DiscoverFiltersProps {
  activeFilters: AdvancedFilterOptions;
  onFilterChange: (filters: AdvancedFilterOptions, savePreference?: boolean) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ 
  activeFilters, 
  onFilterChange,
  isOpen,
  onOpenChange
}) => {
  const [tempFilters, setTempFilters] = useState<AdvancedFilterOptions>(activeFilters);
  const [saveAsPreference, setSaveAsPreference] = useState(false);

  const handleFilterChange = (newFilters: AdvancedFilterOptions) => {
    setTempFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(tempFilters, saveAsPreference);
    onOpenChange(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      // Reset temp filters to active filters when opening dialog
      setTempFilters(activeFilters);
      setSaveAsPreference(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md bg-neutral-900 text-white border-neutral-800">
        <AdvancedFilters
          onFilterChange={handleFilterChange}
          activeFilters={tempFilters}
        />
        <DialogFooter className="px-6 pb-6 pt-2">
          <div className="flex items-center mb-4 w-full">
            <Switch
              id="save-preference"
              checked={saveAsPreference}
              onCheckedChange={setSaveAsPreference}
              className="mr-2"
            />
            <Label htmlFor="save-preference" className="text-sm text-gray-300">
              Save as default preferences
            </Label>
          </div>
          <Button onClick={applyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscoverFilters;
