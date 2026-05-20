import React, { useState } from 'react';
import EmailVerificationPopup from '@/components/auth/EmailVerificationPopup';
import { useDiscoverProfiles } from '@/hooks/discover/useDiscoverProfiles';
import { useEmailVerification } from '@/hooks/discover/useEmailVerification';
import ProfileDisplay from '@/components/discover/ProfileDisplay';
import SimpleDiscoverFilters, { SimpleFilters, DEFAULT_SIMPLE_FILTERS } from '@/components/discover/SimpleDiscoverFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Discover: React.FC = () => {
  const [filters, setFilters] = useState<SimpleFilters>(DEFAULT_SIMPLE_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    currentProfile,
    isLoading,
    handleSwipe,
    setFilters: updateDiscoverFilters,
  } = useDiscoverProfiles({
    minAge: filters.ageRange[0],
    maxAge: filters.ageRange[1],
    maxDistance: filters.distance,
    gender: filters.gender === 'any' ? undefined : filters.gender,
  });

  const { showVerificationPopup, handleVerificationComplete } = useEmailVerification();

  const apply = (next: SimpleFilters) => {
    setFilters(next);
    updateDiscoverFilters({
      minAge: next.ageRange[0],
      maxAge: next.ageRange[1],
      maxDistance: next.distance,
      gender: next.gender === 'any' ? undefined : next.gender,
    }, true);
  };

  const activeCount =
    (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35 ? 1 : 0) +
    (filters.distance !== 50 ? 1 : 0) +
    (filters.gender !== 'any' ? 1 : 0);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <ScrollArea className="h-full w-full overflow-auto">
        <div className="container mx-auto px-4 py-8 pb-24">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Discover People</h1>

          {currentProfile ? (
            <ProfileDisplay
              profile={currentProfile}
              isLoading={isLoading}
              onSwipe={handleSwipe}
              onOpenFilters={() => setIsFilterOpen(true)}
              filterCount={activeCount}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <p className="text-white text-center">
                {isLoading ? 'Loading profiles…' : 'No profiles match your filters yet.'}
              </p>
              {!isLoading && (
                <Button variant="secondary" onClick={() => setIsFilterOpen(true)}>
                  Adjust filters
                </Button>
              )}
            </div>
          )}

          <SimpleDiscoverFilters
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            activeFilters={filters}
            onApply={apply}
          />

          <EmailVerificationPopup isOpen={showVerificationPopup} onClose={handleVerificationComplete} />

          <div className="fixed bottom-20 left-6 z-10">
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 bg-neutral-800/90 text-white hover:bg-neutral-700 rounded-full px-5 py-2 shadow-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px]">
                  {activeCount}
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
