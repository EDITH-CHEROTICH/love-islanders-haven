
import { Profile } from '../utils/dummyData';
import { Edit, Settings } from 'lucide-react';

interface ProfileViewProps {
  profile: Profile;
  isEditable?: boolean;
}

const ProfileView = ({ profile, isEditable = false }: ProfileViewProps) => {
  return (
    <div className="p-4 animate-fade-in">
      <div className="relative mb-6">
        {isEditable && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="bg-island-light/80 p-2 rounded-full" aria-label="Edit profile">
              <Edit size={20} className="text-white" />
            </button>
            <button className="bg-island-light/80 p-2 rounded-full" aria-label="Settings">
              <Settings size={20} className="text-white" />
            </button>
          </div>
        )}
        
        <div className="aspect-square overflow-hidden rounded-xl mb-4">
          <img 
            src={profile.images[0]} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h1>
            <p className="text-muted-foreground">{profile.location}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-love mb-2">About</h2>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-love mb-2">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <span 
                  key={i} 
                  className="bg-love/10 text-love-light px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-love mb-2">Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {profile.images.map((image, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${profile.name} ${i+1}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
