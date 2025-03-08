export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
  interests: string[];
  verified?: boolean;
  relationshipGoal?: 'long-term' | 'casual' | 'both';
}

export const profiles: Profile[] = [
  {
    id: '1',
    name: 'Sophia',
    age: 28,
    location: 'Miami, FL',
    bio: 'Beach lover and yoga instructor. Looking for someone who enjoys sunsets and deep conversations.',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    ],
    interests: ['Yoga', 'Meditation', 'Traveling', 'Cooking'],
    verified: true
  },
  {
    id: '2',
    name: 'James',
    age: 31,
    location: 'Los Angeles, CA',
    bio: 'Photographer and film enthusiast. Let\'s go on an adventure and capture some memories together.',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    interests: ['Photography', 'Hiking', 'Movies', 'Coffee']
  },
  {
    id: '3',
    name: 'Emma',
    age: 26,
    location: 'New York, NY',
    bio: 'Art curator by day, jazz enthusiast by night. Looking for someone to explore galleries and late-night venues.',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    ],
    interests: ['Art', 'Jazz', 'Wine tasting', 'Reading'],
    verified: true
  },
  {
    id: '4',
    name: 'Marcus',
    age: 32,
    location: 'Chicago, IL',
    bio: 'Software engineer who loves to cook and play music. Looking for a partner in crime for food adventures.',
    images: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    ],
    interests: ['Coding', 'Cooking', 'Guitar', 'Traveling']
  },
  {
    id: '5',
    name: 'Olivia',
    age: 27,
    location: 'Austin, TX',
    bio: 'Music festival junkie and dog mom. If you love live music and good food, we\'ll get along just fine.',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    ],
    interests: ['Live music', 'Dogs', 'Food', 'Outdoor activities']
  }
];

export interface Match {
  id: string;
  profile: Profile;
  matchDate: Date;
  lastMessage?: {
    text: string;
    timestamp: Date;
  }
}

export const matches: Match[] = [
  {
    id: 'm1',
    profile: profiles[2],
    matchDate: new Date(2023, 6, 12),
    lastMessage: {
      text: "What's your favorite art gallery in NY?",
      timestamp: new Date(2023, 6, 13, 14, 32)
    }
  },
  {
    id: 'm2',
    profile: profiles[4],
    matchDate: new Date(2023, 6, 14),
    lastMessage: {
      text: "Any concerts coming up you're excited about?",
      timestamp: new Date(2023, 6, 14, 20, 45)
    }
  }
];

export const userProfile: Profile = {
  id: 'user',
  name: 'Alex',
  age: 29,
  location: 'Seattle, WA',
  bio: 'Tech enthusiast and coffee addict. Looking for someone who enjoys deep conversations and spontaneous adventures.',
  images: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
  ],
  interests: ['Technology', 'Coffee', 'Hiking', 'Movies', 'Travel'],
  verified: false,
  relationshipGoal: 'both'
};
