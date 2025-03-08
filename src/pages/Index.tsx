
import { useState, useEffect } from 'react';
import { profiles } from '../utils/dummyData';
import ProfileCard from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import Navbar from '../components/Navbar';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentProfiles, setCurrentProfiles] = useState(profiles);
  const [lastSwipedProfile, setLastSwipedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentProfiles.length === 0) return;
    
    const newProfiles = [...currentProfiles];
    const swipedProfile = newProfiles.shift();
    
    setCurrentProfiles(newProfiles);
    setLastSwipedProfile(swipedProfile);
    
    if (direction === 'right') {
      // Show match notification
      toast(
        <div className="flex items-center">
          <Heart className="text-love mr-2 h-5 w-5" />
          <span>You liked {swipedProfile?.name}!</span>
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gradient">Love Islanders</h1>
      </header>
      
      <main className="container max-w-md mx-auto px-4">
        {loading ? (
          <div className="card-container flex items-center justify-center">
            <div className="loader w-12 h-12 border-4 border-love/20 border-t-love rounded-full animate-spin"></div>
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
              onClick={() => setCurrentProfiles(profiles)}
              className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
            >
              Start Over
            </button>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Index;
