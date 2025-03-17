
import { useState, useEffect } from 'react';
import { profiles, Profile } from '../utils/dummyData';
import ProfileCard from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import ProfileSetup from '../components/ProfileSetup';
import { ProfilePreferences } from '../components/ProfileSetup';
import Navbar from '../components/Navbar';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentProfiles, setCurrentProfiles] = useState<Profile[]>([]);
  const [lastSwipedProfile, setLastSwipedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [userPreferences, setUserPreferences] = useState<ProfilePreferences | null>(null);

  useEffect(() => {
    // Check if the user has already set up their preferences
    const savedPreferences = localStorage.getItem('userPreferences');
    
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        
        // Convert stored date string back to Date object
        if (parsedPreferences.dob) {
          parsedPreferences.dob = new Date(parsedPreferences.dob);
        }
        
        setUserPreferences(parsedPreferences);
        setIsFirstTime(false);
        
        // Filter profiles based on gender preference
        filterProfiles(parsedPreferences.genderPreference);
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
        setLoading(false);
      }
    } else {
      // Simulate loading for first-time users
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const filterProfiles = (genderPreference: 'male' | 'female' | 'both') => {
    let filteredProfiles = [...profiles];
    
    if (genderPreference !== 'both') {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.gender === genderPreference || !profile.gender
      );
    }
    
    setCurrentProfiles(filteredProfiles);
    setLoading(false);
  };

  const handleProfileSetupComplete = (preferences: ProfilePreferences) => {
    if (preferences.age < 18) {
      toast("You must be at least 18 years old to use this app");
      return;
    }
    
    // Store preferences in state and localStorage
    setUserPreferences(preferences);
    
    // Need to stringify dates for localStorage
    const preferencesToStore = {
      ...preferences,
      dob: preferences.dob.toISOString(),
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferencesToStore));
    setIsFirstTime(false);
    
    // Filter profiles based on gender preference
    filterProfiles(preferences.genderPreference);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentProfiles.length === 0) return;
    
    const newProfiles = [...currentProfiles];
    const swipedProfile = newProfiles.shift();
    
    setCurrentProfiles(newProfiles);
    if (swipedProfile) {
      setLastSwipedProfile(swipedProfile);
      
      if (direction === 'right') {
        // Show match notification
        toast(
          <div className="flex items-center">
            <Heart className="text-love mr-2 h-5 w-5" />
            <span>You liked {swipedProfile.name}!</span>
          </div>
        );
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-4">
          <h1 className="text-2xl font-bold text-gradient">Love Islanders</h1>
        </header>
        
        <main className="container max-w-md mx-auto px-4 pb-20">
          {loading ? (
            <div className="card-container flex items-center justify-center">
              <div className="loader w-12 h-12 border-4 border-love/20 border-t-love rounded-full animate-spin"></div>
            </div>
          ) : isFirstTime ? (
            <div className="glass-card p-4 rounded-xl shadow-lg">
              <ProfileSetup onComplete={handleProfileSetupComplete} />
            </div>
          ) : currentProfiles.length > 0 ? (
            <div className="relative">
              <div className="card-container">
                {currentProfiles.slice(0, 3).map((profile, index) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    onSwipe={handleSwipe} 
                  />
                ))}
              </div>
              <SwipeButtons onSwipe={handleSwipe} />
            </div>
          ) : (
            <div className="card-container glass-card flex flex-col items-center justify-center p-8 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2">No more profiles</h2>
              <p className="text-center text-muted-foreground mb-4">
                You've gone through all available profiles. Check back soon!
              </p>
              <button 
                onClick={() => {
                  if (userPreferences) {
                    filterProfiles(userPreferences.genderPreference);
                  } else {
                    setCurrentProfiles(profiles);
                  }
                }}
                className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
              >
                Start Over
              </button>
            </div>
          )}
        </main>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Index;
