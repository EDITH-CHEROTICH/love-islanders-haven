// Define Profile type with all the properties being used in the app
export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  distance: number;
  occupation: string;
  education: string;
  images: string[];
  interests: string[];
  relationshipGoal: 'long-term' | 'casual' | 'both';
  height: string;
  heightCm?: number;
  heightUnit?: 'ft' | 'm' | 'cm';
  lastActive: string;
  verified: boolean;
  location: string;
  gender?: 'male' | 'female' | 'other';
  genderPreference?: 'male' | 'female' | 'both';
  children?: string;
  smoking?: string;
  drinking?: string;
  exercise?: string;
  pets?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  hasPets?: boolean;
  petType?: string;
  videos?: string[];
  activityStatus?: string;
  showAge?: boolean;
}

export interface Match {
  id: string;
  matchDate: string;
  profile: Profile;
}

// Create a user profile for the current user
export const userProfile: Profile = {
  id: 'user-profile-1',
  name: 'Sarah',
  age: 28,
  bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the world with.',
  distance: 0,
  occupation: 'Graphic Designer',
  education: "Bachelor's Degree",
  images: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1964&auto=format&fit=crop'
  ],
  interests: ['Design', 'Photography', 'Travel', 'Coffee'],
  relationshipGoal: 'both',
  height: '168',
  heightCm: 168,
  heightUnit: 'cm',
  lastActive: new Date().toISOString(),
  verified: true,
  location: 'San Francisco, CA',
  gender: 'female',
  genderPreference: 'male',
  children: 'No children',
  smoking: 'Non-smoker',
  drinking: 'Social drinker',
  exercise: 'Regular',
  pets: 'Dog lover',
  hasChildren: false,
  hasPets: true,
  petType: 'dog',
  activityStatus: 'Online',
  showAge: true
};

// Sample profiles for discover page
export const profiles: Profile[] = [
  {
    id: 'profile-1',
    name: 'Alex',
    age: 30,
    bio: 'Hiking enthusiast and dog lover. Looking for someone to share outdoor adventures.',
    distance: 5,
    occupation: 'Software Engineer',
    education: "Master's Degree",
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Hiking', 'Dogs', 'Technology', 'Photography'],
    relationshipGoal: 'long-term',
    height: '185',
    heightCm: 185,
    heightUnit: 'cm',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    verified: true,
    location: 'San Francisco, CA',
    gender: 'male',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Occasionally',
    exercise: 'Regular',
    pets: 'Has pets',
    hasChildren: false,
    hasPets: true,
    petType: 'dog',
    activityStatus: 'Recently active',
    showAge: true
  },
  {
    id: 'profile-2',
    name: 'Emma',
    age: 26,
    bio: 'Artist and music lover. Looking for someone to attend gallery openings and concerts.',
    distance: 8,
    occupation: 'Artist',
    education: "Bachelor's Degree",
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Art', 'Music', 'Fashion', 'Travel'],
    relationshipGoal: 'both',
    height: '163',
    heightCm: 163,
    heightUnit: 'cm',
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    verified: false,
    location: 'San Francisco, CA',
    gender: 'female',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Social drinker',
    exercise: 'Sometimes',
    pets: 'Cat lover',
    hasChildren: false,
    hasPets: true,
    petType: 'cat',
    activityStatus: 'Active today',
    showAge: true
  },
  {
    id: 'profile-3',
    name: 'Michael',
    age: 32,
    bio: 'Food enthusiast and amateur chef. Looking for someone to cook for and explore new restaurants.',
    distance: 15,
    occupation: 'Chef',
    education: "Culinary School",
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Cooking', 'Food', 'Restaurants', 'Travel'],
    relationshipGoal: 'long-term',
    height: '180',
    heightCm: 180,
    heightUnit: 'cm',
    lastActive: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    verified: true,
    location: 'Oakland, CA',
    gender: 'male',
    children: 'No children',
    smoking: 'Non-smoker',
    drinking: 'Enjoys wine',
    exercise: 'Regular',
    pets: 'No pets',
    hasChildren: false,
    hasPets: false,
    activityStatus: 'Online',
    showAge: true
  }
];

// Sample matches for messages page
export const matches: Match[] = [
  {
    id: 'match-1',
    matchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    profile: {
      id: 'profile-1',
      name: 'Alex',
      age: 30,
      bio: 'Hiking enthusiast and dog lover. Looking for someone to share outdoor adventures.',
      distance: 5,
      occupation: 'Software Engineer',
      education: "Master's Degree",
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1964&auto=format&fit=crop'
      ],
      interests: ['Hiking', 'Dogs', 'Technology', 'Photography'],
      relationshipGoal: 'long-term',
      height: '185',
      heightCm: 185,
      heightUnit: 'cm',
      lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      verified: true,
      location: 'San Francisco, CA',
      gender: 'male',
      children: 'No children',
      smoking: 'Non-smoker',
      drinking: 'Occasionally',
      exercise: 'Regular',
      pets: 'Has pets',
      hasChildren: false,
      hasPets: true,
      petType: 'dog',
      activityStatus: 'Recently active',
      showAge: true
    }
  },
  {
    id: 'match-2',
    matchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    profile: {
      id: 'profile-2',
      name: 'Emma',
      age: 26,
      bio: 'Artist and music lover. Looking for someone to attend gallery openings and concerts.',
      distance: 8,
      occupation: 'Artist',
      education: "Bachelor's Degree",
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1964&auto=format&fit=crop'
      ],
      interests: ['Art', 'Music', 'Fashion', 'Travel'],
      relationshipGoal: 'both',
      height: '163',
      heightCm: 163,
      heightUnit: 'cm',
      lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      verified: false,
      location: 'San Francisco, CA',
      gender: 'female',
      children: 'No children',
      smoking: 'Non-smoker',
      drinking: 'Social drinker',
      exercise: 'Sometimes',
      pets: 'Cat lover',
      hasChildren: false,
      hasPets: true,
      petType: 'cat',
      activityStatus: 'Active today',
      showAge: true
    }
  }
];

// Fix type for the heightUnit in the profile samples
profiles.forEach(profile => {
  if (profile.heightUnit && !['ft', 'm', 'cm'].includes(profile.heightUnit as string)) {
    profile.heightUnit = 'cm';
  }
});
