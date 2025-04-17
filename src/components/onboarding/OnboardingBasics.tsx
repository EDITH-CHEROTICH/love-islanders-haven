
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface OnboardingBasicsProps {
  initialData: any;
  onNext: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function OnboardingBasics({
  initialData,
  onNext,
  isSubmitting
}: OnboardingBasicsProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState<Date | undefined>(
    initialData?.dob ? new Date(initialData.dob) : undefined
  );
  const [gender, setGender] = useState<string>(initialData?.gender || 'male');
  const [genderPreference, setGenderPreference] = useState<string>(initialData?.gender_preference || 'both');
  
  const calculateAge = (birthdate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return; // Form validation should prevent this
    }
    
    if (!date) {
      return; // Form validation should prevent this
    }
    
    const age = calculateAge(date);
    if (age < 18) {
      return; // Form validation should prevent this
    }
    
    await onNext({
      name,
      dob: date?.toISOString().split('T')[0], // Format as YYYY-MM-DD
      age,
      gender,
      gender_preference: genderPreference,
      show_age: true
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white text-center">Let's get to know you</h1>
        <p className="text-muted-foreground text-center mt-2">Tell us a bit about yourself</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">What's your name?</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="bg-island-light/20 border-island-light text-white"
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
                  !date && "text-muted-foreground",
                  "bg-island-light/20 border-island-light text-white"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick your date of birth</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  // Disable future dates
                  return date > new Date() || 
                  // Disable dates less than 18 years ago
                  calculateAge(date) < 18 ||
                  // Disable dates more than 100 years ago
                  calculateAge(date) > 100;
                }}
                initialFocus
              />
              {date && calculateAge(date) < 18 && (
                <p className="px-4 py-2 text-sm text-red-500">
                  You must be at least 18 years old
                </p>
              )}
            </PopoverContent>
          </Popover>
          
          {date && (
            <p className="text-sm text-muted-foreground">
              Age: {calculateAge(date)} years old
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label className="text-white">I am a</Label>
          <RadioGroup 
            defaultValue={gender} 
            onValueChange={setGender}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="male"
                id="male"
                className="peer sr-only"
              />
              <Label
                htmlFor="male"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Male</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="female"
                id="female"
                className="peer sr-only"
              />
              <Label
                htmlFor="female"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Female</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="other"
                id="other"
                className="peer sr-only"
              />
              <Label
                htmlFor="other"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Other</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label className="text-white">I want to see</Label>
          <RadioGroup 
            defaultValue={genderPreference} 
            onValueChange={setGenderPreference}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="male"
                id="see-male"
                className="peer sr-only"
              />
              <Label
                htmlFor="see-male"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Men</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="female"
                id="see-female"
                className="peer sr-only"
              />
              <Label
                htmlFor="see-female"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Women</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="both"
                id="see-both"
                className="peer sr-only"
              />
              <Label
                htmlFor="see-both"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-island-light/20 p-4 hover:bg-island-light/30 hover:text-accent-foreground peer-data-[state=checked]:border-love peer-data-[state=checked]:text-love [&:has([data-state=checked])]:border-love"
              >
                <span>Everyone</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-love hover:bg-love-dark text-white"
          disabled={isSubmitting || !name || !date || calculateAge(date || new Date()) < 18}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : "Continue"}
        </Button>
      </form>
    </div>
  );
}

export default OnboardingBasics;
