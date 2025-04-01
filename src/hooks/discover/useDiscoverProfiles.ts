import { useState, useEffect } from 'react';
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from '@/services/discover';
import { Profile } from '@/utils/dummyData';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import { toast } from 'sonner';
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking';

export interface SwipeResult {
  success: boolean;
  isMatch: boolean;
}

// Sample profile images
const SAMPLE_IMAGES = [
  [
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?q=80&w=1964&auto=format&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1964&auto=format&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1964&auto=format&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1964&auto=format&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1964&auto=format&fit=crop'
  ]
];

// Fix the sample profiles to match the updated Profile interface
const SAMPLE_PROFILES: Profile[] = [
  {
    id: 'sample-profile-1',
    name: 'Sophia',
    age: 28,
    gender: 'female',
    bio: 'Beach lover and yoga instructor. Looking for someone who enjoys sunsets and deep conversations.',
    distance: 5,
    occupation: 'Yoga Instructor',
    education: 'Bachelor\'s Degree',
    images: SAMPLE_IMAGES[0],
    interests: ['Yoga', 'Beach', 'Meditation', 'Travel'],
    relationshipGoal: 'both',
    height: '168', // Change to string to match Profile type
    lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // Convert to string
    verified: true,
    location: 'Miami, FL',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Social drinker',
    exercise: 'Regular',
    pets: 'No pets',
    heightCm: 168,
    hasChildren: false,
    hasPets: false,
    activityStatus: 'Online',
    heightUnit: 'm'
  },
  {
    id: 'sample-profile-2',
    name: 'James',
    age: 31,
    gender: 'male',
    bio: 'Photographer and film enthusiast. Let\'s go on an adventure and capture some memories together.',
    distance: 12,
    occupation: 'Photographer',
    education: 'Master\'s Degree',
    images: SAMPLE_IMAGES[1],
    interests: ['Photography', 'Movies', 'Hiking', 'Travel'],
    relationshipGoal: 'both',
    height: '183', // Change to string
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Convert to string
    verified: false,
    location: 'Los Angeles, CA',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Social drinker',
    exercise: 'Sometimes',
    pets: 'Has pets',
    heightCm: 183,
    hasChildren: false,
    hasPets: true,
    petType: 'dog',
    activityStatus: 'Recently active',
    heightUnit: 'm'
  },
  {
    id: 'sample-profile-3',
    name: 'Mia',
    age: 26,
    gender: 'female',
    bio: 'Art curator by day, jazz enthusiast by night. Looking for someone to explore galleries and late-night venues.',
    distance: 8,
    occupation: 'Art Curator',
    education: 'Bachelor\'s Degree',
    images: SAMPLE_IMAGES[2],
    interests: ['Art', 'Music', 'Reading', 'Dancing'],
    relationshipGoal: 'long-term',
    height: '163', // Change to string
    lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Convert to string
    verified: true,
    location: 'New York, NY',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Rarely',
    exercise: 'Regular',
    pets: 'No pets',
    heightCm: 163,
    hasChildren: false,
    hasPets: false,
    activityStatus: 'Active today',
    heightUnit: 'm'
  },
  {
    id: 'sample-profile-4',
    name: 'Marcus',
    age: 32,
    gender: 'male',
    bio: 'Software engineer who loves to cook and play music. Looking for a partner in crime for food adventures.',
    distance: 15,
    occupation: 'Software Engineer',
    education: 'Bachelor\'s Degree',
    images: SAMPLE_IMAGES[3],
    interests: ['Technology', 'Cooking', 'Music', 'Fitness'],
    relationshipGoal: 'both',
    height: '185', // Change to string
    lastActive: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // Convert to string
    verified: false,
    location: 'Chicago, IL',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Social drinker',
    exercise: 'Regular',
    pets: 'No pets',
    heightCm: 185,
    hasChildren: false,
    hasPets: false,
    activityStatus: 'Active yesterday',
    heightUnit: 'm'
  },
  {
    id: 'sample-profile-5',
    name: 'Olivia',
    age: 27,
    gender: 'female',
    bio: 'Music festival junkie and dog mom. If you love live music and good food, we\'ll get along just fine.',
    distance: 20,
    occupation: 'Event Planner',
    education: 'Bachelor\'s Degree',
    images: SAMPLE_IMAGES[4],
    interests: ['Music', 'Dancing', 'Travel', 'Fitness'],
    relationshipGoal: 'casual',
    height: '170', // Change to string
    lastActive: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // Convert to string
    verified: true,
    location: 'Austin, TX',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Social drinker',
    exercise: 'Regular',
    pets: 'Has pets',
    heightCm: 170,
    hasChildren: false,
    hasPets: true,
    petType: 'dog',
    activityStatus: 'Online',
    heightUnit: 'm'
  }
];

// Convert AdvancedFilterOptions to DiscoverFilters
const mapFiltersToDiscoverFilters = (options: AdvancedFilterOptions): DiscoverFilters => {
  return {
    ageRange: options.ageRange,
    distance: options.distance,
    height: options.height,
    relationshipGoals: options.relationshipGoals,
    hasChildren: options.hasChildren === null ? [] : [options.hasChildren ? 'yes' : 'no'],
    education: options.education === null ? [] : [options.education],
    verified: false, // Default
    showVIP: false, // Default
    drinking: [], // Default
    smoking: options.smoking === null ? [] : [options.smoking ? 'yes' : 'no'],
    languages: [], // Default
    interests: options.interests || [],
  };
};

export function useDiscoverProfiles(filters: AdvancedFilterOptions) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { trackAction } = useBehaviorTracking();
  const [useLocalData, setUseLocalData] = useState(false);

  // Load profiles based on filters
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      // First try to fetch from the database
      const fetchedProfiles = await fetchDiscoverProfiles(mapFiltersToDiscoverFilters(filters));
      
      // If no profiles are found, use sample data
      if (fetchedProfiles.length === 0) {
        console.log("No profiles found in database, using sample data");
        setProfiles(SAMPLE_PROFILES);
        setUseLocalData(true);
      } else {
        setProfiles(fetchedProfiles);
        setUseLocalData(false);
      }
    } catch (error) {
      console.error("Error loading profiles, using sample data:", error);
      setProfiles(SAMPLE_PROFILES);
      setUseLocalData(true);
      toast("Using sample data", {
        description: "Could not load profiles from database. Using sample data instead."
      });
    } finally {
      setIsLoading(false);
      setCurrentProfileIndex(0); // Reset index when profiles are reloaded
    }
  };

  // Handle swiping action
  const handleSwipe = async (action: string) => {
    if (!profiles || profiles.length === 0) {
      toast("No profiles available", {
        description: "Please adjust your filters or try again later."
      });
      return;
    }

    const profileId = profiles[currentProfileIndex]?.id;
    const currentProfile = profiles[currentProfileIndex];

    if (!profileId) {
      toast("Error", {
        description: "Profile ID is missing."
      });
      return;
    }

    try {
      // Track user behavior
      trackAction(
        profileId, 
        action === 'right' ? 'like' : 'dislike', 
        currentProfile
      );

      let result: SwipeResult;

      // If using local data, simulate the swipe outcome
      if (useLocalData) {
        // Simulate a 20% chance of a match when swiping right
        const isMatch = action === 'right' && Math.random() < 0.2;
        result = { success: true, isMatch };
      } else {
        // Actually record the swipe in the database
        result = await recordSwipeAction(profileId, action);
      }

      if (result.success) {
        if (result.isMatch && action === 'right') {
          toast("It's a Match!", {
            description: "You and this person have liked each other!"
          });
        }
        goToNextProfile();
      } else {
        toast("Swipe failed", {
          description: "Failed to record swipe action. Please try again."
        });
      }
    } catch (error) {
      console.error("Error recording swipe action:", error);
      toast("Swipe failed", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  // Go to the next profile
  const goToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      toast("No more profiles", {
        description: "You've reached the end of available profiles. Check back later!"
      });
    }
  };

  // Effect to load profiles when filters change
  useEffect(() => {
    loadProfiles();
  }, [JSON.stringify(filters)]); // Use JSON.stringify to avoid infinite loops

  return {
    profiles,
    currentProfileIndex,
    isLoading,
    currentProfile: profiles && profiles.length > 0 ? profiles[currentProfileIndex] : null,
    handleSwipe,
    loadProfiles
  };
}
