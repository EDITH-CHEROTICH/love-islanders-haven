
import { Activity } from 'lucide-react';
import PrivacyControlsSection from './PrivacyControlsSection';
import PrivacyToggle from './PrivacyToggle';
import { usePrivacy } from './PrivacyContext';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ActivityStatusSection = () => {
  const { settings, updatePrivacySetting } = usePrivacy();

  // Set up presence channel for activity status tracking
  useEffect(() => {
    if (!settings.shareActivityStatus) return;

    const setupPresence = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Create a presence channel for the user
        const channel = supabase.channel('online-users');
        
        // Track the user's status
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const presenceTrackStatus = await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
              status: 'online'
            });
            
            console.log('Presence tracking status:', presenceTrackStatus);
          }
        });

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up presence channel:', error);
      }
    };

    setupPresence();
  }, [settings.shareActivityStatus]);

  return (
    <PrivacyControlsSection title="Activity Status" icon={<Activity size={16} className="text-love" />}>
      <PrivacyToggle 
        label="Share your activity status"
        settingKey="shareActivityStatus"
        icon={<Activity size={16} className="text-muted-foreground" />}
        description="Let others know when you're online"
      />
      
      <PrivacyToggle 
        label="Show when you were last active"
        settingKey="lastActiveVisibility"
        icon={<Activity size={16} className="text-muted-foreground" />}
        description="Display when you were last using the app"
      />
    </PrivacyControlsSection>
  );
};

export default ActivityStatusSection;
