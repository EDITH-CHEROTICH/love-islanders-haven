export interface Match {
  id: string;
  profile: Profile;
  lastMessage?: string;
  timestamp?: string;
  unreadMessages?: number;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  distance?: number;
  location?: string;
  bio: string;
  education?: string;
  occupation?: string;
  height?: string;
  interests: string[];
  images: string[];
  compatibility?: number;
  relationshipGoal?: 'casual' | 'long-term' | 'both';
  genderPreference?: 'male' | 'female' | 'both';
  verified?: boolean;
  videos?: string[];
  online?: boolean;
  lastActive?: string;
  showAge?: boolean; // Added this property
}

export const profiles: Profile[] = [
  {
    id: '1',
    name: 'Alice',
    age: 28,
    gender: 'female',
    distance: 5,
    location: 'New York, NY',
    bio: 'Loves hiking, reading, and trying new restaurants.',
    education: 'Master of Science',
    occupation: 'Software Engineer',
    height: '5\'4"',
    interests: ['hiking', 'reading', 'restaurants', 'travel', 'coding'],
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b2933e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1544005313-9431566e9c29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    compatibility: 0.85,
    relationshipGoal: 'long-term',
    genderPreference: 'male',
    verified: true,
    videos: [],
    online: true,
    lastActive: '5 minutes ago',
    showAge: true
  },
  {
    id: '2',
    name: 'Bob',
    age: 32,
    gender: 'male',
    distance: 12,
    location: 'Los Angeles, CA',
    bio: 'Avid surfer, craft beer enthusiast, and dog lover.',
    education: 'Bachelor of Arts',
    occupation: 'Marketing Manager',
    height: '6\'0"',
    interests: ['surfing', 'craft beer', 'dogs', 'music', 'travel'],
    images: [
      'https://images.unsplash.com/photo-1570295999919-56ceb7e86ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1580489944761-15a19d674x?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    compatibility: 0.92,
    relationshipGoal: 'long-term',
    genderPreference: 'female',
    verified: false,
    videos: [],
    online: false,
    lastActive: '2 hours ago',
    showAge: true
  },
  {
    id: '3',
    name: 'Charlie',
    age: 25,
    gender: 'male',
    distance: 8,
    location: 'Chicago, IL',
    bio: 'Gamer, tech enthusiast, and pizza aficionado.',
    education: 'Associate of Applied Science',
    occupation: 'IT Support Specialist',
    height: '5\'9"',
    interests: ['gaming', 'tech', 'pizza', 'movies', 'comics'],
    images: [
      'https://images.unsplash.com/photo-1534528741702-a0cfae562c9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1568602471122-78329514c265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    compatibility: 0.78,
    relationshipGoal: 'casual',
    genderPreference: 'female',
    verified: true,
    videos: [],
    online: true,
    lastActive: '10 minutes ago',
    showAge: true
  },
  {
    id: '4',
    name: 'Diana',
    age: 29,
    gender: 'female',
    distance: 3,
    location: 'San Francisco, CA',
    bio: 'Yoga enthusiast, coffee addict, and travel junkie.',
    education: 'Bachelor of Science',
    occupation: 'Data Scientist',
    height: '5\'7"',
    interests: ['yoga', 'coffee', 'travel', 'photography', 'foodie'],
    images: [
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1589571894960-20c6e828758b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1595152772835-219674b26cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    compatibility: 0.89,
    relationshipGoal: 'long-term',
    genderPreference: 'male',
    verified: true,
    videos: [],
    online: false,
    lastActive: '1 day ago',
    showAge: true
  },
  {
    id: '5',
    name: 'Ethan',
    age: 31,
    gender: 'male',
    distance: 7,
    location: 'Austin, TX',
    bio: 'Musician, outdoor enthusiast, and BBQ connoisseur.',
    education: 'Bachelor of Music',
    occupation: 'Music Teacher',
    height: '5\'11"',
    interests: ['music', 'outdoors', 'bbq', 'concerts', 'sports'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1592666863597-13c77e50c073?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1618043542454-c07149547e99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    compatibility: 0.82,
    relationshipGoal: 'casual',
    genderPreference: 'female',
    verified: false,
    videos: [],
    online: true,
    lastActive: '30 minutes ago',
    showAge: true
  }
];

export const matches: Match[] = [
  {
    id: '101',
    profile: profiles[0],
    lastMessage: 'Hey! How was your hike last weekend?',
    timestamp: '2023-11-15T14:30:00',
    unreadMessages: 2
  },
  {
    id: '102',
    profile: profiles[1],
    lastMessage: 'Surfing was awesome! We should go together sometime.',
    timestamp: '2023-11-14T18:45:00',
    unreadMessages: 0
  },
  {
    id: '103',
    profile: profiles[2],
    lastMessage: 'Just finished a new game, it\'s so cool!',
    timestamp: '2023-11-13T22:10:00',
    unreadMessages: 1
  },
  {
    id: '104',
    profile: profiles[3],
    lastMessage: 'I found a great new coffee place, wanna try it?',
    timestamp: '2023-11-12T09:20:00',
    unreadMessages: 0
  },
  {
    id: '105',
    profile: profiles[4],
    lastMessage: 'I\'m playing at a concert next week, you should come!',
    timestamp: '2023-11-11T16:55:00',
    unreadMessages: 3
  }
];
