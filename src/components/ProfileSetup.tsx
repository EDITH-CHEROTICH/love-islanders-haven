
import { useState } from 'react';
import { Profile } from '../utils/dummyData';
import { useToast } from '@/hooks/use-toast';
import { User, Users, Heart } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (preferences: {
    age: number;
    genderPreference: 'male' | 'female' | 'both';
    gender: 'male' | 'female' | 'other';
  }) => void;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [genderPreference, setGenderPreference] = useState<'male' | 'female' | 'both'>('both');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (age < 18) {
      setError("You must be at least 18 years old to use this app");
      toast({
        title: "Age Restriction",
        description: "You must be at least 18 years old to use this app",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    onComplete({ age, gender, genderPreference });
    
    toast({
      title: "Profile Setup Complete",
      description: "Your preferences have been saved",
    });
  };

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-xl font-bold text-love mb-6 text-center">Complete Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium text-white">
            How old are you?
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            min={18}
            max={100}
            className="w-full p-2 bg-island-dark border border-island-light rounded-lg text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-xs text-muted-foreground">You must be at least 18 years old to use this app</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            What's your gender?
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                gender === 'male' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <User size={24} className={gender === 'male' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Male</span>
            </button>
            
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                gender === 'female' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <User size={24} className={gender === 'female' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Female</span>
            </button>
            
            <button
              type="button"
              onClick={() => setGender('other')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                gender === 'other' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <Users size={24} className={gender === 'other' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Other</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            Who would you like to see?
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setGenderPreference('male')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                genderPreference === 'male' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <User size={24} className={genderPreference === 'male' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Men</span>
            </button>
            
            <button
              type="button"
              onClick={() => setGenderPreference('female')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                genderPreference === 'female' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <User size={24} className={genderPreference === 'female' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Women</span>
            </button>
            
            <button
              type="button"
              onClick={() => setGenderPreference('both')}
              className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                genderPreference === 'both' 
                  ? 'bg-love text-white' 
                  : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
              }`}
            >
              <Users size={24} className={genderPreference === 'both' ? 'text-white' : 'text-love'} />
              <span className="text-sm mt-2">Everyone</span>
            </button>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-love hover:bg-love-light text-white py-3 rounded-lg font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
