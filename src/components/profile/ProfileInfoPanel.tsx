
import React from 'react';
import { Profile } from '@/utils/dummyData';
import { 
  Check, 
  MapPin, 
  Briefcase, 
  GraduationCap
} from 'lucide-react';

interface ProfileInfoPanelProps {
  profile: Profile;
  onClose: (e: React.MouseEvent) => void;
}

const ProfileInfoPanel = ({ profile, onClose }: ProfileInfoPanelProps) => {
  return (
    <div 
      className="absolute inset-0 bg-black/70 backdrop-blur-sm p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div className="text-white space-y-4">
        <h2 className="text-2xl font-bold flex items-center">
          {profile.name}
          <span className="ml-2">{profile.age}</span>
          {profile.verified && (
            <div className="bg-blue-500 rounded-full p-0.5 ml-2">
              <Check size={16} className="text-white" />
            </div>
          )}
        </h2>
        
        {profile.location && (
          <div className="flex items-center text-white/80">
            <MapPin size={16} className="mr-2" />
            {profile.location}
          </div>
        )}
        
        {profile.occupation && (
          <div className="flex items-center text-white/80">
            <Briefcase size={16} className="mr-2" />
            {profile.occupation}
          </div>
        )}
        
        {profile.education && (
          <div className="flex items-center text-white/80">
            <GraduationCap size={16} className="mr-2" />
            {profile.education}
          </div>
        )}
        
        {profile.bio && (
          <div>
            <h3 className="text-sm uppercase text-white/60 mb-1">About me</h3>
            <p className="text-white/90">{profile.bio}</p>
          </div>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h3 className="text-sm uppercase text-white/60 mb-1">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span 
                  key={idx} 
                  className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {profile.relationshipGoal && (
            <div>
              <h3 className="text-xs uppercase text-white/60 mb-1">Looking for</h3>
              <p className="text-white/90 capitalize">{profile.relationshipGoal.replace('-', ' ')}</p>
            </div>
          )}
          
          {profile.heightCm && (
            <div>
              <h3 className="text-xs uppercase text-white/60 mb-1">Height</h3>
              <p className="text-white/90">
                {profile.heightCm} cm
                {profile.height ? ` (${profile.height} ${profile.heightUnit || 'ft'})` : ''}
              </p>
            </div>
          )}
          
          {profile.hasChildren !== undefined && (
            <div>
              <h3 className="text-xs uppercase text-white/60 mb-1">Children</h3>
              <p className="text-white/90">
                {profile.hasChildren ? 
                  (profile.childrenCount ? `${profile.childrenCount} children` : 'Has children') : 
                  'No children'}
              </p>
            </div>
          )}
          
          {profile.hasPets !== undefined && (
            <div>
              <h3 className="text-xs uppercase text-white/60 mb-1">Pets</h3>
              <p className="text-white/90">
                {profile.hasPets ? 
                  (profile.petType ? `Has ${profile.petType}` : 'Has pets') : 
                  'No pets'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoPanel;
