
import React, { useState } from 'react';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import EmailVerificationPopup from '@/components/auth/EmailVerificationPopup';
import { useAuth } from '@/context/auth';
import { useDiscoverProfiles } from '@/hooks/discover/useDiscoverProfiles';
import { useEmailVerification } from '@/hooks/discover/useEmailVerification';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import ProfileDisplay from '@/components/discover/ProfileDisplay';

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
  const { currentProfile, isLoading, handleSwipe } = useDiscoverProfiles(filters);
  const { showVerificationPopup, handleVerificationComplete } = useEmailVerification();

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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Discover People</h1>

        {/* Profile display component */}
        <ProfileDisplay 
          profile={currentProfile} 
          isLoading={isLoading} 
          onSwipe={handleSwipe}
          onOpenFilters={openFilterDialog}
          filterCount={countActiveFilters()}
        />

        {/* Filters component */}
        <DiscoverFilters 
          activeFilters={filters} 
          onFilterChange={setFilters}
          isOpen={isFilterDialogOpen}
          onOpenChange={setIsFilterDialogOpen}
        />
        
        {/* Email Verification Popup */}
        <EmailVerificationPopup 
          isOpen={showVerificationPopup}
          onClose={handleVerificationComplete}
        />
      </div>
    </div>
  );
};

export default Discover;
