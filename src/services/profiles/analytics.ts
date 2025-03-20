
import { supabase } from "@/integrations/supabase/client";

export interface ProfileStats {
  likes: number;
  views: number;
  matches: number;
  messageResponses: number;
  averageResponseTime: number;
  responseRate: number;
  conversionRate: number;
}

export interface DemographicData {
  age: {
    age: string;
    count: number;
  }[];
  location: {
    location: string;
    count: number;
  }[];
}

export const fetchProfileStats = async (timeRange: 'week' | 'month' | 'year'): Promise<ProfileStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const userId = user.id;
  
  // Get date range for query
  const now = new Date();
  let startDate = new Date();
  
  if (timeRange === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (timeRange === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }
  
  // Format dates for PostgreSQL
  const startDateStr = startDate.toISOString();
  const endDateStr = now.toISOString();
  
  // Get profile views (from likes table as a proxy since we don't have a dedicated views table)
  const { count: viewsCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_id', userId)
    .gte('created_at', startDateStr)
    .lte('created_at', endDateStr);
  
  // Get likes received
  const { count: likesCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_id', userId)
    .gte('created_at', startDateStr)
    .lte('created_at', endDateStr);
  
  // Get matches
  const { count: matchesCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .gte('matched_at', startDateStr)
    .lte('matched_at', endDateStr);
  
  // Get message response stats
  const { data: messages } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      sent_at,
      match_id
    `)
    .eq('sender_id', userId)
    .gte('sent_at', startDateStr)
    .lte('sent_at', endDateStr);
  
  // Count response messages
  const messageResponses = messages?.length || 0;
  
  // These metrics would require more complex queries or additional tables
  // Using placeholder logic for now
  const averageResponseTime = 25; // minutes
  const responseRate = messageResponses > 0 ? 75 : 0; // percentage
  
  // Calculate conversion rate (matches / likes)
  const conversionRate = likesCount > 0 ? (matchesCount / likesCount) * 100 : 0;
  
  return {
    views: viewsCount || 0,
    likes: likesCount || 0,
    matches: matchesCount || 0,
    messageResponses,
    averageResponseTime,
    responseRate,
    conversionRate
  };
};

export const fetchDemographics = async (): Promise<DemographicData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // In a real app, this would be derived from actual profile views data
  // For now, we'll return realistic mock data
  // In the future, you could create a profile_views table to track this information
  
  return {
    age: [
      { age: '18-24', count: 25 },
      { age: '25-30', count: 40 },
      { age: '31-35', count: 20 },
      { age: '36-40', count: 10 },
      { age: '41+', count: 5 },
    ],
    location: [
      { location: 'New York', count: 30 },
      { location: 'Los Angeles', count: 25 },
      { location: 'Chicago', count: 15 },
      { location: 'San Francisco', count: 20 },
      { location: 'Other', count: 10 },
    ]
  };
};
