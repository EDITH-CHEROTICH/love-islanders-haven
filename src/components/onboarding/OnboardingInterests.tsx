import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import InterestsPicker from './InterestsPicker';

interface OnboardingInterestsProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function OnboardingInterests({
  initialData,
  onNext,
  onBack,
  isSubmitting
}: OnboardingInterestsProps) {
  const [interests, setInterests] = useState<string[]>(initialData?.interests || []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length >= 3) {
      onNext({ interests });
    }
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Your Interests</h1>
      <p className="text-gray-300 mb-6">Pick things you're into. This helps us find better matches for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <InterestsPicker 
          value={interests} 
          onChange={setInterests}
          maxSelections={10}
        />
        
        <div className="flex space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-love hover:bg-love-dark"
            disabled={isSubmitting || interests.length < 3}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default OnboardingInterests;
