
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tab, Tabs, TabList, TabPanel } from '@/components/ui/tabs';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileMedia from '@/components/profile/ProfileMedia';
import ProfileActionBar from '@/components/profile/ProfileActionBar';
import ProfileInsights from '@/components/profile/ProfileInsights';
import { Button } from '@/components/ui/button';
import { Calendar, Info, Settings, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { profiles } from '@/utils/dummyData';

// For demo purposes, we'll use the first profile in the dummy data
const currentProfile = profiles[0];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleEditProfile = () => {
    navigate('/settings');
  };
  
  const handleShareProfile = () => {
    // Logic to share profile would go here
    toast({
      title: "Profile Shared",
      description: "Your profile link has been copied to clipboard",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container">
        <header className="text-center pt-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">My Profile</h1>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabList className="flex w-full bg-background/50 backdrop-blur-md rounded-lg p-1 mb-6">
            <Tab value="profile" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Tab>
            <Tab value="insights" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
              <Info className="h-4 w-4 mr-2" />
              Insights
            </Tab>
            <Tab value="calendar" className="flex-1 py-2 rounded-md data-[state=active]:bg-love/20">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Tab>
          </TabList>
          
          <TabPanel value="profile">
            <div className="space-y-6">
              <ProfileMedia profile={currentProfile} editable={true} />
              
              <ProfileDetails profile={currentProfile} editable={true} />
              
              <ProfileActionBar 
                onEdit={handleEditProfile}
                onShare={handleShareProfile}
              />
            </div>
          </TabPanel>
          
          <TabPanel value="insights">
            <div className="space-y-6">
              <Alert>
                <AlertTitle>Profile Performance</AlertTitle>
                <AlertDescription>
                  See how your profile is performing and get insights on how to improve it.
                </AlertDescription>
              </Alert>
              
              <ProfileInsights />
            </div>
          </TabPanel>
          
          <TabPanel value="calendar">
            <div className="space-y-6">
              <Alert>
                <AlertTitle>Date Planning</AlertTitle>
                <AlertDescription>
                  Plan your dates and set up safety measures for when you meet someone.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => navigate('/settings')} 
                className="w-full"
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Safety Features
              </Button>
              
              {/* Placeholder for date calendar - would be implemented in a real app */}
              <div className="border rounded-lg p-8 text-center bg-background/50 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-2">No upcoming dates</h3>
                <p className="text-muted-foreground">
                  When you plan a date with someone, it will appear here.
                </p>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
