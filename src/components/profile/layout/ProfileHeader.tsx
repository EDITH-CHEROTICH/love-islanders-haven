
import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";
import { useAuth } from "@/context/auth";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader = ({ isEditing, onEditToggle }: ProfileHeaderProps) => {
  const { user } = useAuth();
  const email = user?.email || localStorage.getItem('authContact') || 'User';
  
  return (
    <div className="flex justify-between items-center py-4 px-2">
      <div>
        <h1 className="text-xl font-bold text-gradient">My Profile</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <Button 
        variant="ghost"
        className={`rounded-full p-2 ${isEditing ? 'bg-love text-white' : 'bg-background text-love'}`}
        onClick={onEditToggle}
      >
        {isEditing ? <Check className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default ProfileHeader;
