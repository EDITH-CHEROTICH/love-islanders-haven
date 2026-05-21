
import { Button } from "@/components/ui/button";
import { Edit, Check, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader = ({ isEditing, onEditToggle }: ProfileHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const email = user?.email || localStorage.getItem('authContact') || 'User';

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      toast.error(error?.message || 'Could not log out. Please try again.');
    }
  };
  
  return (
    <div className="flex justify-between items-center py-4 px-2">
      <div>
        <h1 className="text-xl font-bold text-gradient">My Profile</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          className={`rounded-full p-2 ${isEditing ? 'bg-love text-white' : 'bg-background text-love'}`}
          onClick={onEditToggle}
          aria-label={isEditing ? 'Done editing' : 'Edit profile'}
        >
          {isEditing ? <Check className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          className="rounded-full p-2 bg-background text-muted-foreground hover:text-love"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
