
import React, { useState, useEffect } from 'react';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import EmailVerificationPopup from '@/components/auth/EmailVerificationPopup';
import { useAuth } from '@/context/auth';
import { useDiscoverProfiles } from '@/hooks/discover/useDiscoverProfiles';
import { useEmailVerification } from '@/hooks/discover/useEmailVerification';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import ProfileDisplay from '@/components/discover/ProfileDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiscoverFilters as DiscoverFiltersType } from '@/services/discover';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Default filter state
const DEFAULT_FILTERS: AdvancedFilterOptions = {
  ageRange: [18, 35],
  distance: 50,
  height: [150, 190],
  heightUnit: 'cm',
  relationshipGoals: [],
  hasChildren: null,
  hasPets: null,
  smoking: null,
  education: null,
  occupation: null,
  interests: [],
};

const Discover: React.FC = () => {
  // State for filters
  const [filters, setFilters] = useState<AdvancedFilterOptions>(DEFAULT_FILTERS);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Custom hooks
  const { isAuthenticated } = useAuth();
  const { 
    currentProfile, 
    isLoading, 
    handleSwipe,
    setFilters: updateDiscoverFilters,
    filters: savedFilters
  } = useDiscoverProfiles({
    minAge: filters.ageRange[0],
    maxAge: filters.ageRange[1],
    maxDistance: filters.distance
  });

  const { showVerificationPopup, handleVerificationComplete } = useEmailVerification();
  
  // Update local filters when saved filters load
  useEffect(() => {
    if (savedFilters && Object.keys(savedFilters).length > 0) {
      setFilters({
        ...DEFAULT_FILTERS,
        ...savedFilters
      });
    }
  }, [savedFilters]);

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    
    // Default values from AdvancedFilters
    if (filters.ageRange[0] !== DEFAULT_FILTERS.ageRange[0] || 
        filters.ageRange[1] !== DEFAULT_FILTERS.ageRange[1]) count++;
    if (filters.distance !== DEFAULT_FILTERS.distance) count++;
    if (filters.height[0] !== DEFAULT_FILTERS.height[0] || 
        filters.height[1] !== DEFAULT_FILTERS.height[1]) count++;
    if (filters.relationshipGoals.length > 0) count++;
    if (filters.hasChildren !== null) count++;
    if (filters.hasPets !== null) count++;
    if (filters.smoking !== null) count++;
    if (filters.education !== null) count++;
    if (filters.occupation !== null) count++;
    if (filters.interests.length > 0) count++;
    
    return count;
  };

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
  };
  
  const handleFilterChange = (newFilters: AdvancedFilterOptions, savePreference: boolean = false) => {
    setFilters(newFilters);
    
    // Convert AdvancedFilterOptions to DiscoverFilters format
    const discoverFilters: DiscoverFiltersType = {
      minAge: newFilters.ageRange[0],
      maxAge: newFilters.ageRange[1],
      maxDistance: newFilters.distance,
      // Add other filter properties as needed
    };
    
    updateDiscoverFilters(discoverFilters, savePreference);
  };

  const filterCount = countActiveFilters();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <ScrollArea className="h-full w-full overflow-auto">
        <div className="container mx-auto px-4 py-8 pb-32">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Discover People</h1>

          {/* Profile display component or empty state */}
          {currentProfile ? (
            <ProfileDisplay 
              profile={currentProfile} 
              isLoading={isLoading} 
              onSwipe={handleSwipe}
              onOpenFilters={openFilterDialog}
              filterCount={filterCount}
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-white text-center">No profiles found with the current filters.</p>
            </div>
          )}
          
          {/* Filters component */}
          <DiscoverFilters 
            activeFilters={filters} 
            onFilterChange={handleFilterChange}
            isOpen={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          />
          
          {/* Email Verification Popup */}
          <EmailVerificationPopup 
            isOpen={showVerificationPopup}
            onClose={handleVerificationComplete}
          />
          
          {/* Fixed Filter Button */}
          <div className="fixed bottom-20 left-6 z-10">
            <Button 
              onClick={openFilterDialog} 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-2 bg-neutral-800/90 text-white hover:bg-neutral-700 rounded-full px-5 py-2 shadow-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {filterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px]">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;
