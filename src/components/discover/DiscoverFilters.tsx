
import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    <div>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <AdvancedFilters
          onFilterChange={handleFilterChange}
          activeFilters={tempFilters}
        />
        <DialogFooter className="px-6 pb-6 pt-2">
          <div className="flex items-center mb-4 w-full">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsPreference}
                onChange={() => setSaveAsPreference(!saveAsPreference)}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm text-muted-foreground">Save as default preferences</span>
            </label>
          </div>
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DiscoverFilters;
