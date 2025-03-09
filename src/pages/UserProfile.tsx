
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileView from '../components/ProfileView';
import { userProfile } from '../utils/dummyData';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authMethod');
    localStorage.removeItem('authContact');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    
    // Redirect to signup page
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Your Profile</h1>
      </header>
      
      <main className="container max-w-md mx-auto px-4">
        <ProfileView profile={userProfile} isEditable={true} />
        
        <div className="flex justify-center mt-6">
          <button 
            className="flex items-center gap-2 text-muted-foreground hover:text-love transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </main>
      
      <Navbar />
    </div>
  );
};

export default UserProfile;
