
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface BlockedUserType {
  blocked_user_id: string;
  profiles: {
    id: string;
    name: string;
  };
}

const BlockReportSection = () => {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserType[]>([]);

  // Fetch blocked users on component mount
  useEffect(() => {
    if (user?.id) {
      fetchBlockedUsers(user.id);
    }
  }, [user?.id]);

  const fetchBlockedUsers = async (userId: string) => {
    try {
      // Updated query to use a simpler approach without requiring a direct relation
      const { data: blockedUserIds, error: blockedError } = await supabase
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', userId);

      if (blockedError) throw blockedError;
      
      // If no blocked users, set empty array
      if (!blockedUserIds || blockedUserIds.length === 0) {
        setBlockedUsers([]);
        return;
      }
      
      // Get profile details for each blocked user
      const blockedUserList: BlockedUserType[] = [];
      
      for (const item of blockedUserIds) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', item.blocked_user_id)
          .single();
          
        if (!profileError && profileData) {
          blockedUserList.push({
            blocked_user_id: item.blocked_user_id,
            profiles: {
              id: profileData.id,
              name: profileData.name
            }
          });
        }
      }
      
      setBlockedUsers(blockedUserList);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  };

  const unblockUser = async (blockedUserId: string) => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('user_id', user.id)
        .eq('blocked_user_id', blockedUserId);

      if (error) throw error;
      
      // Refresh blocked users list
      if (user?.id) {
        fetchBlockedUsers(user.id);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Users</CardTitle>
        <CardDescription>
          Manage the users you've blocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blockedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't blocked any users.</p>
          ) : (
            <div className="space-y-2">
              {blockedUsers.map((blockedUser) => (
                <div key={blockedUser.blocked_user_id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span>{blockedUser.profiles?.name || 'Unknown User'}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => unblockUser(blockedUser.blocked_user_id)}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockReportSection;
