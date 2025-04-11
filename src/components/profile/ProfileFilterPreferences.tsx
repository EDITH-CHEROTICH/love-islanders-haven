
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { getDiscoverFilters, saveDiscoverFilters } from '@/services/profiles/profile-update';
import { useToast } from '@/hooks/use-toast';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';

interface ProfileFilterPreferencesProps {
  onPreferencesUpdated?: () => void;
}

const ProfileFilterPreferences = ({ onPreferencesUpdated }: ProfileFilterPreferencesProps) => {
  const [filters, setFilters] = useState<AdvancedFilterOptions>({
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
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load saved filters when component mounts
  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = async () => {
    setIsLoading(true);
    try {
      const savedFilters = await getDiscoverFilters();
      if (savedFilters) {
        // Map from DiscoverFilters to AdvancedFilterOptions
        setFilters({
          ...filters,
          ageRange: [savedFilters.minAge || 18, savedFilters.maxAge || 35],
          distance: savedFilters.maxDistance || 50,
          // Add other properties as they become available in the savedFilters
        });
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFilters = async () => {
    setIsLoading(true);
    try {
      // Convert AdvancedFilterOptions to DiscoverFilters format
      const discoverFilters = {
        minAge: filters.ageRange[0],
        maxAge: filters.ageRange[1],
        maxDistance: filters.distance,
        // Add other properties as needed
      };

      await saveDiscoverFilters(discoverFilters);
      
      toast({
        title: "Preferences Saved",
        description: "Your discovery preferences have been updated.",
      });
      
      if (onPreferencesUpdated) {
        onPreferencesUpdated();
      }
    } catch (error) {
      console.error('Error saving filters:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your preferences.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgeRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: value as [number, number]
    }));
  };

  const handleDistanceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      distance: value[0]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-white mb-4">Discovery Preferences</h3>
        
        <div className="space-y-8">
          {/* Age Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="age-range" className="text-sm">Age Range</Label>
              <Badge variant="outline" className="text-xs">
                {filters.ageRange[0]} - {filters.ageRange[1]}
              </Badge>
            </div>
            <Slider
              id="age-range"
              min={18}
              max={99}
              step={1}
              value={filters.ageRange}
              onValueChange={handleAgeRangeChange}
              className="my-4"
            />
          </div>
          
          {/* Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="distance" className="text-sm">Distance (km)</Label>
              <Badge variant="outline" className="text-xs">
                {filters.distance}
              </Badge>
            </div>
            <Slider
              id="distance"
              min={1}
              max={100}
              step={1}
              value={[filters.distance]}
              onValueChange={handleDistanceChange}
              className="my-4"
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSaveFilters} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Discovery Preferences"}
      </Button>
    </div>
  );
};

export default ProfileFilterPreferences;
