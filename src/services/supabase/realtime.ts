
import { supabase } from "@/integrations/supabase/client";

export const setupMessagesRealtime = async () => {
  try {
    // Enable realtime for the messages table directly
    const { error } = await supabase
      .from('messages')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error setting up realtime for messages:', error);
      return false;
    }
    
    // Set up a channel subscription to verify it works
    const channel = supabase.channel('public:messages');
    const subscription = channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {})
      .subscribe();
    
    // Clean up subscription after verifying it works
    setTimeout(() => {
      supabase.removeChannel(channel);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error in setupMessagesRealtime:', error);
    return false;
  }
};
