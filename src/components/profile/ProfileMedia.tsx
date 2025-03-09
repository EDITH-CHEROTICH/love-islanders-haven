
import { Profile } from '../../utils/dummyData';

interface ProfileMediaProps {
  profile: Profile;
}

const ProfileMedia = ({ profile }: ProfileMediaProps) => {
  return (
    <div className="space-y-4">
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
      
      {profile.videos && profile.videos.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-love mb-2">Videos</h2>
          <div className="grid grid-cols-2 gap-2">
            {profile.videos.map((video, i) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden">
                <video 
                  src={video}
                  controls
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMedia;
