import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { getBlockedUsers, unblockUser } from '@/services/profiles/blocking';
import { ScrollArea } from "@/components/ui/scroll-area"

const BlockReportSection = () => {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBlockedUsers();
  }, []);
  
  const fetchBlockedUsers = async () => {
    try {
      const { data, error } = await getBlockedUsers();
      
      // Use the correctly typed data
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load blocked users",
          variant: "destructive",
        });
        return;
      }
      
      setBlockedUsers(data || []);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      toast({
        title: "Error",
        description: "Failed to load blocked users",
        variant: "destructive",
      });
    }
  };
  
  const handleUnblockUser = async (userId: string) => {
    try {
      const { error } = await unblockUser(userId);
      
      if (error) {
        throw error;
      }
      
      // Refresh the blocked users list
      fetchBlockedUsers();
      
      toast({
        title: "User unblocked",
        description: "You've successfully unblocked this user",
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!blockedUsers || blockedUsers.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Blocked Accounts</h3>
        <p className="text-sm text-muted-foreground">
          You haven't blocked any accounts yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Blocked Accounts</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border">
        <div className="divide-y divide-border">
          {blockedUsers.map((blockedUser) => (
            <div key={blockedUser.blocked_user_id} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={blockedUser.profiles?.avatar_url} />
                  <AvatarFallback>{blockedUser.profiles?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{blockedUser.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">@{blockedUser.profiles?.name}</p>
                </div>
              </div>
              <Button size="sm" onClick={() => handleUnblockUser(blockedUser.blocked_user_id)}>
                Unblock
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlockReportSection;
