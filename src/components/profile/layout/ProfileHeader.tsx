
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader = ({ isEditing, onEditToggle }: ProfileHeaderProps) => {
  return (
    <header className="text-center pt-4 mb-6 relative">
      <h1 className="text-2xl font-bold text-gradient">My Profile</h1>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEditToggle}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? "Done" : "Edit"}
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
