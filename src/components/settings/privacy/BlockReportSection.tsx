
import { useState, useEffect } from 'react';
import { UserX, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getBlockedUsers, unblockUser } from '@/services/profiles/blocking';
import { supabase } from '@/integrations/supabase/client';
import PrivacyControlsSection from './PrivacyControlsSection';

const BlockReportSection = () => {
  const [isBlockedUsersOpen, setIsBlockedUsersOpen] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    checkAuth();
  }, []);

  const fetchBlockedUsers = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await getBlockedUsers(userId);
      setBlockedUsers(data);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      toast.error('Failed to load blocked users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBlockedUsers = () => {
    setIsBlockedUsersOpen(true);
    fetchBlockedUsers();
  };

  const handleUnblockUser = async (blockedUserId: string) => {
    if (!userId) return;
    
    try {
      await unblockUser(userId, blockedUserId);
      setBlockedUsers(blockedUsers.filter(user => user.blocked_user_id !== blockedUserId));
      toast.success('User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  return (
    <PrivacyControlsSection title="Block & Report" icon={<UserX size={16} className="text-love" />}>
      <Button 
        variant="outline" 
        className="w-full bg-island-light/10 border-island-light/40"
        onClick={handleOpenBlockedUsers}
      >
        <UserX size={16} className="mr-2" />
        Manage Blocked Users
      </Button>
      
      <Dialog open={isBlockedUsersOpen} onOpenChange={setIsBlockedUsersOpen}>
        <DialogContent className="bg-island-dark border-island-light text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Blocked Users</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Manage users you've blocked. Blocked users can't message you or see your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : blockedUsers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Shield className="mx-auto mb-2 text-muted-foreground" size={32} />
                <p>You haven't blocked anyone yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedUsers.map((blockedUser) => (
                  <div 
                    key={blockedUser.blocked_user_id} 
                    className="flex items-center justify-between p-3 rounded-md bg-island-light/10"
                  >
                    <div>
                      <p className="font-medium">{blockedUser.profiles?.name || 'Unknown User'}</p>
                      {blockedUser.profiles?.age && (
                        <p className="text-sm text-muted-foreground">Age: {blockedUser.profiles.age}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUnblockUser(blockedUser.blocked_user_id)}
                      className="text-love hover:text-love hover:bg-love/10"
                    >
                      <X size={16} className="mr-1" /> Unblock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PrivacyControlsSection>
  );
};

export default BlockReportSection;
