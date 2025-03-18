import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'message' | 'like' | 'profile_view';
  content: string;
  related_user_id?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Fetches all notifications for the current user
 * @returns Array of notification objects
 */
export const getNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Marks a notification as read
 * @param notificationId ID of the notification to mark as read
 * @returns Boolean indicating success
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Marks all notifications as read for the current user
 * @returns Boolean indicating success
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Sets up a realtime subscription to notifications
 * @param onNewNotification Callback function when a new notification is received
 * @returns Cleanup function to remove the subscription
 */
export const subscribeToNotifications = (
  onNewNotification: (notification: Notification) => void
) => {
  try {
    const user = supabase.auth.getUser().then(({ data }) => data.user);
    
    // If we can't get the user right away, return an empty cleanup function
    if (!user) return () => {};
    
    // Get user ID asynchronously and then set up the subscription
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      
      const channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            
            // Display a toast notification
            toast(notification.content, {
              description: getNotificationDescription(notification),
              position: 'top-right',
              duration: 5000,
            });
            
            // Call the callback with the new notification
            onNewNotification(notification);
          }
        )
        .subscribe();
        
      // Store the channel in a global variable so we can unsubscribe later
      window.__notificationChannel = channel;
    });
    
    // Return cleanup function
    return () => {
      if (window.__notificationChannel) {
        supabase.removeChannel(window.__notificationChannel);
      }
    };
  } catch (error) {
    console.error('Error setting up notification subscription:', error);
    return () => {};
  }
};

// Helper function to get a description based on notification type
const getNotificationDescription = (notification: Notification) => {
  switch (notification.type) {
    case 'match':
      return 'You have a new match!';
    case 'message':
      return 'You have a new message';
    case 'like':
      return 'Someone liked your profile';
    case 'profile_view':
      return 'Someone viewed your profile';
    default:
      return '';
  }
};

// Add this to the global window object for TypeScript
declare global {
  interface Window {
    __notificationChannel?: ReturnType<typeof supabase.channel>;
  }
}
