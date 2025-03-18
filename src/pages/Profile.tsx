
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ProfileView from '@/components/ProfileView';
import { userProfile } from '@/utils/dummyData';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">Your Profile</h1>
        </header>
        
        <main className="container max-w-md mx-auto px-4 pb-20">
          <ProfileView profile={userProfile} isEditable={true} />
          
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              variant="outline"
              className="flex items-center justify-center gap-2 w-full bg-island-light/10 border-island-light"
              onClick={handleSettings}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Button>
            
            <button 
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-love transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
