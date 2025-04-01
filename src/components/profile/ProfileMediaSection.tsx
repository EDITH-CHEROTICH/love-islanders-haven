
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileImageCarousel from './ProfileImageCarousel';

interface ProfileMediaSectionProps {
  profile: {
    images: string[];
    name: string;
    videos?: string[];
  };
  visibleImagesIndices?: number[];
  isMyProfile?: boolean;
}

const ProfileMediaSection = ({ profile, visibleImagesIndices, isMyProfile = false }: ProfileMediaSectionProps) => {
  const [activeTab, setActiveTab] = useState<'images'>('images');
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'images')}>
        <TabsList className="w-full">
          <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="rounded-lg overflow-hidden aspect-square">
            <ProfileImageCarousel 
              images={profile.images}
              name={profile.name}
              visibleImagesIndices={visibleImagesIndices}
              isEditable={isMyProfile}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileMediaSection;
