
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, Info, Calendar } from 'lucide-react';
import ProfileViewContent from './ProfileViewContent';
import ProfileInsightsContent from './ProfileInsightsContent';
import ProfileCalendarContent from './ProfileCalendarContent';
import { Profile } from '@/utils/dummyData';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: Profile;
  onEdit: () => void;
}

const ProfileTabs = ({ activeTab, setActiveTab, profile, onEdit }: ProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex w-full bg-background/50 backdrop-blur-md rounded-lg p-1 mb-6">
        <TabsTrigger value="profile" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
          <User className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
          <Info className="h-4 w-4 mr-2" />
          Insights
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileViewContent profile={profile} onEdit={onEdit} />
      </TabsContent>
      
      <TabsContent value="insights">
        <ProfileInsightsContent />
      </TabsContent>
      
      <TabsContent value="calendar">
        <ProfileCalendarContent />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
