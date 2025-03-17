import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, Users, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createOrUpdateProfile } from '@/services/profiles/core';

export interface ProfilePreferences {
  age: number;
  dob: Date;
  showAge: boolean;
  genderPreference: 'male' | 'female' | 'both';
  gender: 'male' | 'female' | 'other';
  education?: string;
  hobby?: string[];
  hasPets?: boolean;
  petType?: string;
  heightUnit: 'ft' | 'm';
  height?: number;
  heightCm?: number;
  hasChildren?: boolean;
  childrenCount?: number;
  occupation?: string;
}

interface ProfileSetupProps {
  onComplete: (preferences: ProfilePreferences) => void;
}

const educationOptions = [
  'High School', 
  'Some College', 
  'Associate Degree', 
  'Bachelor\'s Degree', 
  'Master\'s Degree', 
  'Doctorate', 
  'Prefer not to say'
];

const hobbyOptions = [
  'Reading', 'Cooking', 'Gardening', 'Hiking', 'Photography', 'Painting', 
  'Music', 'Dancing', 'Sports', 'Gaming', 'Traveling', 'Yoga', 'Meditation', 
  'Fishing', 'Camping', 'Writing', 'Movies', 'Theater', 'Shopping', 'Fashion'
];

const petOptions = ['Dogs', 'Cats', 'Birds', 'Fish', 'Reptiles', 'Other'];

const occupationFields = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Legal', 'Creative Arts', 
  'Engineering', 'Science', 'Retail', 'Hospitality', 'Manufacturing', 'Transportation', 
  'Construction', 'Agriculture', 'Government', 'Military', 'Student', 'Retired', 'Other'
];

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [preferences, setPreferences] = useState<ProfilePreferences>({
    age: 18,
    dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    showAge: true,
    gender: 'male',
    genderPreference: 'both',
    heightUnit: 'ft',
    height: 5.7, // Default height in feet
    heightCm: 173, // Default height in cm
    hobby: [],
    hasPets: false,
    hasChildren: false,
    childrenCount: 0
  });
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAge = (birthday: Date): number => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDobChange = (date: Date | undefined) => {
    if (!date) return;
    
    const age = calculateAge(date);
    if (age < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be at least 18 years old to use this app",
        variant: "destructive",
      });
      return;
    }
    
    setPreferences({
      ...preferences,
      dob: date,
      age: age
    });
  };

  const handleToggleHobby = (hobby: string) => {
    setPreferences(prev => {
      const currentHobbies = prev.hobby || [];
      const updated = currentHobbies.includes(hobby)
        ? currentHobbies.filter(h => h !== hobby)
        : [...currentHobbies, hobby];
      
      return {
        ...prev,
        hobby: updated
      };
    });
  };

  const handleHeightChange = (value: string, unit: 'ft' | 'm') => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (unit === 'ft') {
      const cmValue = Math.round(numValue * 30.48); // Convert feet to cm
      setPreferences({
        ...preferences,
        height: numValue,
        heightCm: cmValue,
        heightUnit: 'ft'
      });
    } else {
      const ftValue = numValue / 30.48; // Convert cm to feet
      setPreferences({
        ...preferences,
        height: parseFloat(ftValue.toFixed(1)),
        heightCm: numValue,
        heightUnit: 'm'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (preferences.age < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be at least 18 years old to use this app",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createOrUpdateProfile(preferences, name);
      
      toast({
        title: "Profile Setup Complete",
        description: "Your preferences have been saved",
      });
      
      onComplete(preferences);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === "basic") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("lifestyle");
    else if (activeTab === "lifestyle") {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "lifestyle") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("basic");
  };

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-xl font-bold text-love mb-6 text-center">Complete Your Profile</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Your Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">When were you born?</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !preferences.dob && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {preferences.dob ? (
                    format(preferences.dob, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={preferences.dob}
                  onSelect={handleDobChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="showAge" 
                checked={preferences.showAge}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, showAge: checked === true})
                }
              />
              <label
                htmlFor="showAge"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              >
                Show my age on my profile
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Your age: {preferences.age} years old
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">What's your gender?</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, gender: 'male'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.gender === 'male' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <User size={24} className={preferences.gender === 'male' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Male</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, gender: 'female'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.gender === 'female' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <User size={24} className={preferences.gender === 'female' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Female</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, gender: 'other'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.gender === 'other' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <Users size={24} className={preferences.gender === 'other' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Other</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Who would you like to see?</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, genderPreference: 'male'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.genderPreference === 'male' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <User size={24} className={preferences.genderPreference === 'male' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Men</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, genderPreference: 'female'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.genderPreference === 'female' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <User size={24} className={preferences.genderPreference === 'female' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Women</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => setPreferences({...preferences, genderPreference: 'both'})}
                className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
                  preferences.genderPreference === 'both' 
                    ? 'bg-love text-white' 
                    : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
                }`}
                variant="ghost"
              >
                <Users size={24} className={preferences.genderPreference === 'both' ? 'text-white' : 'text-love'} />
                <span className="text-sm mt-2">Everyone</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Education Level</Label>
            <Select 
              onValueChange={(value) => setPreferences({...preferences, education: value})}
              value={preferences.education}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                {educationOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Height</Label>
            <div className="flex gap-2">
              <Select 
                onValueChange={(value) => setPreferences({...preferences, heightUnit: value as 'ft' | 'm'})}
                value={preferences.heightUnit}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ft">Feet</SelectItem>
                  <SelectItem value="m">Meters</SelectItem>
                </SelectContent>
              </Select>
              
              {preferences.heightUnit === 'ft' ? (
                <Input
                  type="number"
                  step="0.1"
                  value={preferences.height}
                  onChange={(e) => handleHeightChange(e.target.value, 'ft')}
                  placeholder="Height in feet"
                  className="flex-1"
                />
              ) : (
                <Input
                  type="number"
                  step="1"
                  value={preferences.heightCm}
                  onChange={(e) => handleHeightChange(e.target.value, 'm')}
                  placeholder="Height in cm"
                  className="flex-1"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {preferences.heightUnit === 'ft' 
                ? `${preferences.height} ft (${preferences.heightCm} cm)` 
                : `${preferences.heightCm} cm (${preferences.height} ft)`}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Occupation</Label>
            <Select 
              onValueChange={(value) => setPreferences({...preferences, occupation: value})}
              value={preferences.occupation}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your field of work" />
              </SelectTrigger>
              <SelectContent>
                {occupationFields.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Hobbies & Interests (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {hobbyOptions.map((hobby) => (
                <div key={hobby} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`hobby-${hobby}`} 
                    checked={(preferences.hobby || []).includes(hobby)}
                    onCheckedChange={() => handleToggleHobby(hobby)}
                  />
                  <label
                    htmlFor={`hobby-${hobby}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {hobby}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasPets" 
                checked={preferences.hasPets}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, hasPets: checked === true})
                }
              />
              <label
                htmlFor="hasPets"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              >
                Do you have pets?
              </label>
            </div>
            
            {preferences.hasPets && (
              <Select 
                onValueChange={(value) => setPreferences({...preferences, petType: value})}
                value={preferences.petType}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="What kind of pet do you have?" />
                </SelectTrigger>
                <SelectContent>
                  {petOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasChildren" 
                checked={preferences.hasChildren}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, hasChildren: checked === true})
                }
              />
              <label
                htmlFor="hasChildren"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              >
                Do you have children?
              </label>
            </div>
            
            {preferences.hasChildren && (
              <div className="mt-2">
                <Label className="text-white">How many children?</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={preferences.childrenCount}
                  onChange={(e) => setPreferences({
                    ...preferences, 
                    childrenCount: parseInt(e.target.value) || 0
                  })}
                  placeholder="Number of children"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-6 pt-4">
        {activeTab !== "basic" && (
          <Button
            type="button"
            onClick={handlePreviousTab}
            variant="outline"
            className="px-4"
          >
            Back
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleNextTab}
          className="bg-love hover:bg-love-light text-white px-6 ml-auto"
          disabled={isSubmitting}
        >
          {activeTab === "lifestyle" ? (isSubmitting ? "Saving..." : "Complete") : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;
