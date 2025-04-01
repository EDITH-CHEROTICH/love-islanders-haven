
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
}

const ProfileMediaSection = ({ profile, visibleImagesIndices }: ProfileMediaSectionProps) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'images' | 'videos')}>
        <TabsList className="w-full">
          <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="rounded-lg overflow-hidden aspect-square">
            <ProfileImageCarousel 
              images={profile.images}
              name={profile.name}
              visibleImagesIndices={visibleImagesIndices}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          {profile.videos && profile.videos.length > 0 ? (
            <div className="aspect-video rounded-lg bg-island-dark/50 flex items-center justify-center">
              <video 
                src={profile.videos[0]} 
                controls 
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-island-dark/50 flex items-center justify-center text-muted-foreground">
              No videos added
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileMediaSection;
