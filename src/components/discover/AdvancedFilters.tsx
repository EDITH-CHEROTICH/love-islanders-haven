
import { useState } from 'react';
import { Filter, Coffee, Briefcase, GraduationCap, Smoking, Plus, Minus } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export interface AdvancedFilterOptions {
  ageRange: [number, number];
  distance: number;
  height: [number, number];
  relationshipGoals: string[];
  hasChildren: boolean | null;
  hasPets: boolean | null;
  smoking: boolean | null;
  education: string | null;
  occupation: string | null;
  interests: string[];
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: AdvancedFilterOptions) => void;
  activeFilters: AdvancedFilterOptions;
}

const DEFAULT_FILTERS: AdvancedFilterOptions = {
  ageRange: [18, 50],
  distance: 50,
  height: [150, 210],
  relationshipGoals: [],
  hasChildren: null,
  hasPets: null,
  smoking: null,
  education: null,
  occupation: null,
  interests: [],
};

const RELATIONSHIP_GOALS = [
  'Casual dating',
  'Long-term relationship',
  'Marriage',
  'Friendship',
  'Not sure yet'
];

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Ph.D. or Doctorate',
  'Prefer not to say'
];

const INTERESTS = [
  'Travel', 'Cooking', 'Movies', 'Music', 'Reading',
  'Sports', 'Fitness', 'Art', 'Photography', 'Gaming',
  'Dancing', 'Hiking', 'Yoga', 'Meditation', 'Pets',
  'Coffee', 'Wine', 'Food', 'Fashion', 'Technology'
];

const AdvancedFilters = ({ onFilterChange, activeFilters }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<AdvancedFilterOptions>({
    ...DEFAULT_FILTERS,
    ...activeFilters
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    
    // Check for modified filters from default values
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

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setSheetOpen(false);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const addInterest = () => {
    if (newInterest && !filters.interests.includes(newInterest)) {
      setFilters({
        ...filters,
        interests: [...filters.interests, newInterest]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFilters({
      ...filters,
      interests: filters.interests.filter(i => i !== interest)
    });
  };

  const toggleRelationshipGoal = (goal: string) => {
    if (filters.relationshipGoals.includes(goal)) {
      setFilters({
        ...filters,
        relationshipGoals: filters.relationshipGoals.filter(g => g !== goal)
      });
    } else {
      setFilters({
        ...filters,
        relationshipGoals: [...filters.relationshipGoals, goal]
      });
    }
  };

  return (
    <div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {countActiveFilters() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                {countActiveFilters()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>
              Refine your search with more specific criteria
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4 space-y-6">
            {/* Age Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Age Range</h3>
                <span className="text-sm text-muted-foreground">
                  {filters.ageRange[0]} - {filters.ageRange[1]} years
                </span>
              </div>
              <Slider
                defaultValue={filters.ageRange}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => 
                  setFilters({ ...filters, ageRange: [value[0], value[1]] as [number, number] })
                }
                className="mt-2"
              />
            </div>
            
            <Separator />
            
            {/* Distance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Distance</h3>
                <span className="text-sm text-muted-foreground">
                  Up to {filters.distance} km
                </span>
              </div>
              <Slider
                defaultValue={[filters.distance]}
                min={1}
                max={150}
                step={1}
                onValueChange={(value) => 
                  setFilters({ ...filters, distance: value[0] })
                }
                className="mt-2"
              />
            </div>
            
            <Separator />
            
            {/* Height Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Height (cm)</h3>
                <span className="text-sm text-muted-foreground">
                  {filters.height[0]} - {filters.height[1]} cm
                </span>
              </div>
              <Slider
                defaultValue={filters.height}
                min={140}
                max={220}
                step={1}
                onValueChange={(value) => 
                  setFilters({ ...filters, height: [value[0], value[1]] as [number, number] })
                }
                className="mt-2"
              />
            </div>
            
            <Separator />
            
            {/* Relationship Goals */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Relationship Goals</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {RELATIONSHIP_GOALS.map(goal => (
                  <Badge
                    key={goal}
                    variant={filters.relationshipGoals.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleRelationshipGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Deal Breakers */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Deal Breakers</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smoking className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="smoking">Smoking</Label>
                </div>
                <Select
                  value={filters.smoking === null ? "any" : filters.smoking ? "yes" : "no"}
                  onValueChange={(value) => {
                    let smokingValue = null;
                    if (value === "yes") smokingValue = true;
                    if (value === "no") smokingValue = false;
                    setFilters({ ...filters, smoking: smokingValue });
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasChildren">Has Children</Label>
                </div>
                <Select
                  value={filters.hasChildren === null ? "any" : filters.hasChildren ? "yes" : "no"}
                  onValueChange={(value) => {
                    let childrenValue = null;
                    if (value === "yes") childrenValue = true;
                    if (value === "no") childrenValue = false;
                    setFilters({ ...filters, hasChildren: childrenValue });
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasPets">Has Pets</Label>
                </div>
                <Select
                  value={filters.hasPets === null ? "any" : filters.hasPets ? "yes" : "no"}
                  onValueChange={(value) => {
                    let petsValue = null;
                    if (value === "yes") petsValue = true;
                    if (value === "no") petsValue = false;
                    setFilters({ ...filters, hasPets: petsValue });
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            {/* Education & Occupation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <Label>Education</Label>
                </div>
                <Select
                  value={filters.education || ""}
                  onValueChange={(value) => 
                    setFilters({ ...filters, education: value || null })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Education Level</SelectItem>
                    {EDUCATION_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Label>Occupation</Label>
                </div>
                <Input 
                  placeholder="Any occupation" 
                  value={filters.occupation || ""} 
                  onChange={(e) => 
                    setFilters({ ...filters, occupation: e.target.value || null })
                  }
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Interests */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Interests</h3>
              <p className="text-xs text-muted-foreground">Find people who share your interests</p>
              
              <div className="flex gap-2 mt-2">
                <Select
                  value={newInterest}
                  onValueChange={setNewInterest}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERESTS.filter(i => !filters.interests.includes(i)).map(interest => (
                      <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={addInterest}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.interests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {interest}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeInterest(interest)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {filters.interests.length === 0 && (
                  <p className="text-xs text-muted-foreground">No interests selected</p>
                )}
              </div>
            </div>
          </div>
          
          <SheetFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdvancedFilters;
