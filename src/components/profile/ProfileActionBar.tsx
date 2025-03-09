
import { Edit, Settings } from 'lucide-react';

interface ProfileActionBarProps {
  onEdit: () => void;
  onSettings: () => void;
}

const ProfileActionBar = ({ onEdit, onSettings }: ProfileActionBarProps) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button 
        className="bg-island-light/80 p-2 rounded-full hover:bg-island-light transition-colors" 
        aria-label="Edit profile"
        onClick={onEdit}
      >
        <Edit size={20} className="text-white" />
      </button>
      <button 
        className="bg-island-light/80 p-2 rounded-full hover:bg-island-light transition-colors" 
        aria-label="Settings"
        onClick={onSettings}
      >
        <Settings size={20} className="text-white" />
      </button>
    </div>
  );
};

export default ProfileActionBar;
