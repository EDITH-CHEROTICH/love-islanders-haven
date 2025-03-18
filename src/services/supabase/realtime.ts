
import { supabase } from "@/integrations/supabase/client";

export const setupMessagesRealtime = async () => {
  // Enable realtime for the messages table
  const { error } = await supabase.rpc('enable_realtime_for_table', {
    table_name: 'messages'
  });
  
  if (error) {
    console.error('Error enabling realtime for messages:', error);
    return false;
  }
  
  return true;
};
