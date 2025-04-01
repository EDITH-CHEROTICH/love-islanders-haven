
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import AdvancedFilters, { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';

interface DiscoverFiltersProps {
  activeFilters: AdvancedFilterOptions;
  onFilterChange: (filters: AdvancedFilterOptions) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ 
  activeFilters, 
  onFilterChange,
  isOpen,
  onOpenChange
}) => {
  const applyFilters = (newFilters: AdvancedFilterOptions) => {
    onFilterChange(newFilters);
    onOpenChange(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <AdvancedFilters
          onFilterChange={applyFilters}
          activeFilters={activeFilters}
        />
      </Dialog>
    </div>
  );
};

export default DiscoverFilters;
