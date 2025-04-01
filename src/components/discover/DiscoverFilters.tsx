import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sliders } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import AdvancedFilters, { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import { Badge } from '@/components/ui/badge';

interface DiscoverFiltersProps {
  activeFilters: AdvancedFilterOptions;
  onFilterChange: (filters: AdvancedFilterOptions) => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ activeFilters, onFilterChange }) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setIsFilterDialogOpen(false);
  };

  const applyFilters = (newFilters: AdvancedFilterOptions) => {
    onFilterChange(newFilters);
    closeFilterDialog();
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    
    // Default values from AdvancedFilters
    const DEFAULT_FILTERS = {
      ageRange: [18, 50],
      distance: 50,
      height: [150, 210],
      heightUnit: 'cm',
      relationshipGoals: [],
      hasChildren: null,
      hasPets: null,
      smoking: null,
      education: null,
      occupation: null,
      interests: [],
    };
    
    // Check for modified filters from default values
    if (activeFilters.ageRange[0] !== DEFAULT_FILTERS.ageRange[0] || 
        activeFilters.ageRange[1] !== DEFAULT_FILTERS.ageRange[1]) count++;
    if (activeFilters.distance !== DEFAULT_FILTERS.distance) count++;
    if (activeFilters.height[0] !== DEFAULT_FILTERS.height[0] || 
        activeFilters.height[1] !== DEFAULT_FILTERS.height[1]) count++;
    if (activeFilters.relationshipGoals.length > 0) count++;
    if (activeFilters.hasChildren !== null) count++;
    if (activeFilters.hasPets !== null) count++;
    if (activeFilters.smoking !== null) count++;
    if (activeFilters.education !== null) count++;
    if (activeFilters.occupation !== null) count++;
    if (activeFilters.interests.length > 0) count++;
    
    return count;
  };

  return (
    <div>
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <AdvancedFilters
          onFilterChange={applyFilters}
          activeFilters={activeFilters}
        />
      </Dialog>
    </div>
  );
};

export default DiscoverFilters;
