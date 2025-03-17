// Helper functions for building user context for the AI

export async function fetchUserProfile(supabase, userId) {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    return null;
  }
  
  console.log("Retrieved user profile:", profileData);
  return profileData;
}

export async function fetchUserSettings(supabase, userId) {
  const { data: settingsData, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (settingsError) {
    console.error("Error fetching user settings:", settingsError);
    return null;
  }
  
  console.log("Retrieved user settings:", settingsData);
  return settingsData;
}

export async function fetchUserStreakActivity(supabase, userId) {
  const { data: streakData, error: streakError } = await supabase
    .rpc('get_user_streak_activity', { user_id: userId });

  if (streakError) {
    console.error("Error fetching user streak activity:", streakError);
    return null;
  }
  
  console.log("Retrieved user streak activity:", streakData);
  return streakData;
}

export async function fetchUserInterests(supabase, userId) {
  const { data: interestsData, error: interestsError } = await supabase
    .from('profile_interests')
    .select('interests(name)')
    .eq('profile_id', userId);
  
  if (interestsError) {
    console.error("Error fetching user interests:", interestsError);
    return [];
  }
  
  return interestsData ? interestsData.map(item => item.interests.name) : [];
}

export function buildUserMemoryContext(userProfile, userSettings, userStreakActivity, interests) {
  let userMemoryContext = "";
  
  if (userProfile) {
    userMemoryContext += `User Profile Information:\n`;
    userMemoryContext += `- Name: ${userProfile.name}\n`;
    userMemoryContext += `- Age: ${userProfile.age}\n`;
    userMemoryContext += `- Gender: ${userProfile.gender}\n`;
    if (userProfile.bio) userMemoryContext += `- Bio: ${userProfile.bio}\n`;
    if (userProfile.occupation) userMemoryContext += `- Occupation: ${userProfile.occupation}\n`;
    if (userProfile.education) userMemoryContext += `- Education: ${userProfile.education}\n`;
    if (userProfile.location) userMemoryContext += `- Location: ${userProfile.location}\n`;
    userMemoryContext += `- Relationship Goal: ${userProfile.relationship_goal || 'Not specified'}\n`;
    
    if (interests && interests.length > 0) {
      userMemoryContext += `- Interests: ${interests.join(', ')}\n`;
    }
  }

  if (userSettings) {
    userMemoryContext += `\nUser Preferences:\n`;
    
    // AI Companion preferences
    if (userSettings.ai_companion_settings) {
      const aiSettings = userSettings.ai_companion_settings;
      userMemoryContext += `- AI Companion Style: ${aiSettings.conversationStyle || 'Not specified'}\n`;
      userMemoryContext += `- AI Voice Tone: ${aiSettings.voiceTone || 'Not specified'}\n`;
    }

    // Other relevant settings
    if (userSettings.match_preferences) {
      const matchPrefs = userSettings.match_preferences;
      if (matchPrefs.ageRange) {
        userMemoryContext += `- Preferred Age Range: ${matchPrefs.ageRange[0]}-${matchPrefs.ageRange[1]}\n`;
      }
    }
  }

  // Add streak activity information to context
  if (userStreakActivity && userStreakActivity.length > 0) {
    userMemoryContext += `\nUser Streak Activity:\n`;
    userStreakActivity.forEach((streak, index) => {
      if (index < 5) { // Only include last 5 streaks to save tokens
        userMemoryContext += `- Streak ${index+1}: "${streak.streak_content.substring(0, 100)}${streak.streak_content.length > 100 ? '...' : ''}" (${streak.likes_count} likes, streak count: ${streak.streak_count})\n`;
      }
    });
    
    // Extract patterns and topics from streaks
    const allStreakContent = userStreakActivity.map(s => s.streak_content).join(' ');
    const topics = extractTopicsFromContent(allStreakContent);
    if (topics.length > 0) {
      userMemoryContext += `- Common topics in streaks: ${topics.join(', ')}\n`;
    }
    
    // Add streak consistency information
    const isConsistent = checkStreakConsistency(userStreakActivity);
    userMemoryContext += `- Streak consistency: ${isConsistent ? 'User maintains consistent streaks' : 'User has gaps in streak activity'}\n`;
    
    const totalLikes = userStreakActivity.reduce((sum, streak) => sum + streak.likes_count, 0);
    userMemoryContext += `- Total likes received: ${totalLikes}\n`;
  }

  console.log("User memory context created:", userMemoryContext);
  return userMemoryContext;
}

// Extract topics from content using basic keyword detection
export function extractTopicsFromContent(content) {
  const topics = [];
  const keywords = [
    'fitness', 'health', 'workout', 'exercise', 'running', 'gym',
    'food', 'cooking', 'recipe', 'meal', 'diet', 'nutrition',
    'travel', 'trip', 'vacation', 'destination', 'journey',
    'work', 'job', 'career', 'office', 'project', 'business',
    'study', 'learning', 'education', 'school', 'college', 'university',
    'family', 'friends', 'relationship', 'date', 'dating', 'love',
    'music', 'song', 'concert', 'album', 'artist',
    'movie', 'film', 'tv', 'show', 'series', 'episode',
    'book', 'reading', 'novel', 'author',
    'technology', 'tech', 'phone', 'computer', 'app', 'software',
    'art', 'painting', 'drawing', 'creativity',
    'mental health', 'meditation', 'mindfulness', 'therapy', 'wellness'
  ];
  
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase()) && !topics.includes(keyword)) {
      topics.push(keyword);
    }
  });
  
  return topics.slice(0, 5); // Return top 5 topics
}

// Check if user maintains consistent streaks
export function checkStreakConsistency(streaks) {
  if (streaks.length < 2) return false;
  
  // Sort by date
  const sortedStreaks = [...streaks].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Check if most streaks are within 48 hours of each other
  let consistentCount = 0;
  for (let i = 1; i < sortedStreaks.length; i++) {
    const prev = new Date(sortedStreaks[i-1].created_at).getTime();
    const curr = new Date(sortedStreaks[i].created_at).getTime();
    const diffHours = (curr - prev) / (1000 * 60 * 60);
    
    if (diffHours <= 48) {
      consistentCount++;
    }
  }
  
  return consistentCount >= (sortedStreaks.length / 2);
}
