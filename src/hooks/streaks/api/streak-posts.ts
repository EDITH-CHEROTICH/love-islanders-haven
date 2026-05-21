
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData, CreateStreakParams } from "../types";

const uploadStreakMedia = async (userId: string, postId: string, media: string[]) => {
  const uploadedUrls: string[] = [];

  for (const [index, item] of media.entries()) {
    if (!item.startsWith('data:')) {
      uploadedUrls.push(item);
      continue;
    }

    const response = await fetch(item);
    const blob = await response.blob();
    const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
    const path = `${userId}/streaks/${postId}-${index}.${extension}`;
    const { error } = await supabase.storage.from('profile-images').upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      upsert: true,
    });

    if (error) throw error;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};

/**
 * Fetches streak posts from Supabase
 */
export const fetchStreakPosts = async (): Promise<StreakData[]> => {
  try {
    const { data, error } = await (supabase
      .from('streaks' as any)
      .select(`
        id,
        user_id,
        content,
        caption,
        created_at,
        streak_count,
        likes_count,
        comments_count,
        expires_at
      `)
      .order('created_at', { ascending: false })
      .limit(20) as any);

    if (error) {
      console.error("Error fetching streak posts:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Fetch profile names and avatars for the post authors
    const userIds = Array.from(new Set(data.map((p: any) => p.user_id))) as string[];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    const profileMap = new Map<string, { name: string; avatar_url?: string }>();
    (profiles || []).forEach((p: any) => profileMap.set(p.id, { name: p.name || 'Unknown User', avatar_url: p.avatar_url || undefined }));

    return data.map((item: any) => {
      const author = profileMap.get(item.user_id);
      let parsedContent: string[] = [];
      try {
        const parsed = JSON.parse(item.content);
        parsedContent = Array.isArray(parsed) ? parsed.filter(Boolean) : [String(parsed)].filter(Boolean);
      } catch {
        parsedContent = item.content ? [item.content] : [];
      }

      return {
        ...item,
        content: parsedContent,
        user_name: author?.name || 'Unknown User',
        user_profile_image: author?.avatar_url,
        profiles: { name: author?.name || 'Unknown User' },
      };
    }) as any;
  } catch (error) {
    console.error("Error in fetchStreakPosts:", error);
    return [];
  }
};

/**
 * Creates a new streak post
 */
export const createStreakPost = async ({
  userId,
  content,
  streakCount,
  expiresAt,
  caption
}: CreateStreakParams): Promise<StreakData | null> => {
  try {
    // Validate content
    if (!content || content.length === 0) {
      throw new Error("No content provided");
    }

    // Create post data
    const postId = uuidv4();
    const uploadedContent = await uploadStreakMedia(userId, postId, content);
    const contentString = JSON.stringify(uploadedContent);
    const createdAt = new Date().toISOString();
    
    const postData = {
      id: postId,
      user_id: userId,
      content: contentString,
      caption,
      streak_count: streakCount,
      expires_at: expiresAt,
      likes_count: 0, 
      comments_count: 0,
      created_at: createdAt
    };
    
    // Insert streak post
    const { error } = await (supabase
      .from('streaks' as any)
      .insert(postData) as any);
      
    if (error) {
      throw error;
    }

    // Get profile info
    await supabase
      .from('profiles')
      .update({ streak_count: streakCount })
      .eq('id', userId);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', userId)
      .single();

    // Return the created post with user data
    return {
      ...postData,
      content: uploadedContent,
      user_name: profileData?.name || "You",
      user_profile_image: profileData?.avatar_url || undefined,
      profiles: { 
        name: profileData?.name || "You" 
      }
    } as any;
  } catch (error) {
    console.error("Error creating streak post:", error);
    return null;
  }
};
