import React from 'react';
import { Check, MapPin } from 'lucide-react';
import { Profile } from '@/utils/dummyData';
interface ProfileBottomInfoProps {
  profile: Profile;
}
const ProfileBottomInfo = ({
  profile
}: ProfileBottomInfoProps) => {
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-6 px-[17px] py-[37px] mx-[3px] my-[20px]">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-white">
          {profile.name}
          <span className="ml-2">{profile.age}</span>
        </h2>
        
        {profile.verified && <div className="bg-blue-500 rounded-full p-0.5">
            <Check size={16} className="text-white" />
          </div>}
      </div>
      
      {profile.location && <div className="flex items-center text-white/80 text-sm mt-1">
          <MapPin size={14} className="mr-1" />
          {profile.location}
        </div>}
      
      <div className="mt-2">
        <h3 className="text-white/80 text-sm">Interests</h3>
        <div className="flex flex-wrap mt-1 gap-2">
          {profile.interests && profile.interests.slice(0, 5).map((interest, i) => <span key={i} className="bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              {interest}
            </span>)}
        </div>
      </div>
    </div>;
};
export default ProfileBottomInfo;