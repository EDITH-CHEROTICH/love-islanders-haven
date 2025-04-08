
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const BlockReportSection = () => {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  // Fetch blocked users on component mount
  useEffect(() => {
    if (user?.id) {
      fetchBlockedUsers(user.id);
    }
  }, [user?.id]);

  const fetchBlockedUsers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select(`
          blocked_user_id,
          profiles!inner (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      setBlockedUsers(data || []);
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
      fetchBlockedUsers(user.id);
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
