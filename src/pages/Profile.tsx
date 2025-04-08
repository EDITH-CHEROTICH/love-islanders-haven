import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileMedia from '@/components/profile/ProfileMedia';
import ProfileActionBar from '@/components/profile/ProfileActionBar';
import ProfileInsights from '@/components/profile/ProfileInsights';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import ProfileImageManager from '@/components/profile/ProfileImageManager';
import ProfileDisplayPreferences from '@/components/profile/ProfileDisplayPreferences';
import { Button } from '@/components/ui/button';
import { Calendar, Info, Settings, User, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/profiles/core';
import { Skeleton } from '@/components/ui/skeleton';
import { profiles } from '@/utils/dummyData';
import { useAuth } from '@/context/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(profiles[0]); // Default to dummy data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    } else {
      // If not authenticated, set loading to false but keep dummy data
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserProfile();
      if (userData) {
        // Update profile with real user data, including images
        setProfile(prev => ({
          ...prev,
          name: userData.name || prev.name,
          age: userData.age || prev.age,
          bio: userData.bio || prev.bio,
          education: userData.education || prev.education,
          occupation: userData.occupation || prev.occupation,
          gender: userData.gender || prev.gender,
          images: userData.images?.length ? userData.images : prev.images,
          showAge: userData.show_age !== undefined ? userData.show_age : true,
          verified: userData.verified || prev.verified,
          relationshipGoal: userData.relationship_goal,
          genderPreference: userData.gender_preference
        }));

        console.log("Loaded profile with images:", userData.images);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Failed to load profile",
        description: "Using demo data instead. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleImagesChange = (newImages: string[]) => {
    setProfile({
      ...profile,
      images: newImages
    });
  };

  const handleVerificationSuccess = () => {
    setProfile({
      ...profile,
      verified: true
    });
  };

  const handlePreferencesUpdated = () => {
    loadUserProfile();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
        <div className="page-container pt-8 space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container">
        <header className="text-center pt-4 mb-6 relative">
          <h1 className="text-2xl font-bold text-gradient">My Profile</h1>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEditProfile}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Done" : "Edit"}
            </Button>
          </div>
        </header>
        
        {!isEditing ? (
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
              <div className="space-y-6">
                <ProfileMedia 
                  profile={profile} 
                  isMyProfile={true}
                />
                
                <ProfileDetails profile={profile} />
                
                <ProfileActionBar 
                  onEdit={handleEditProfile}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>Profile Performance</AlertTitle>
                  <AlertDescription>
                    See how your profile is performing and get insights on how to improve it.
                  </AlertDescription>
                </Alert>
                
                <ProfileInsights />
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
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
                
                <ProfileCalendar />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-8">
            <div className="p-4 bg-island-light/10 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              
              <div className="space-y-8">
                <ProfileImageManager 
                  images={profile.images}
                  verified={profile.verified || false}
                  onImagesChange={handleImagesChange}
                  onVerificationRequest={handleVerificationSuccess}
                />
                
                <ProfileDisplayPreferences 
                  initialDisplayName={profile.name}
                  initialShowAge={profile.showAge !== undefined ? profile.showAge : true}
                  onPreferencesUpdated={handlePreferencesUpdated}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleEditProfile}
              className="w-full"
              variant="outline"
            >
              Done Editing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
