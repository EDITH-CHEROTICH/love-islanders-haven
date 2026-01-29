import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterestsPickerProps {
  value: string[];
  onChange: (interests: string[]) => void;
  maxSelections?: number;
}

const interestCategories = [
  {
    category: 'Activities',
    items: ['Hiking', 'Gym', 'Yoga', 'Running', 'Swimming', 'Dancing', 'Cycling', 'Gaming']
  },
  {
    category: 'Music',
    items: ['Pop', 'Hip Hop', 'Rock', 'Jazz', 'R&B', 'Country', 'Electronic', 'Classical']
  },
  {
    category: 'Food & Drink',
    items: ['Cooking', 'Wine', 'Coffee', 'Brunch', 'Vegan', 'Foodie', 'BBQ', 'Baking']
  },
  {
    category: 'Entertainment',
    items: ['Movies', 'Netflix', 'Reading', 'Art', 'Theater', 'Comedy', 'Concerts', 'Photography']
  },
  {
    category: 'Lifestyle',
    items: ['Travel', 'Fashion', 'Shopping', 'Meditation', 'Volunteering', 'Pets', 'Plants', 'DIY']
  },
  {
    category: 'Social',
    items: ['Parties', 'Board Games', 'Karaoke', 'Festivals', 'Sports Bars', 'Trivia', 'Clubbing', 'Wine Tasting']
  }
];

export function InterestsPicker({ 
  value = [], 
  onChange, 
  maxSelections = 10 
}: InterestsPickerProps) {
  const toggleInterest = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter(i => i !== interest));
    } else if (value.length < maxSelections) {
      onChange([...value, interest]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white">What are you into?</Label>
        <span className="text-sm text-muted-foreground">
          {value.length}/{maxSelections} selected
        </span>
      </div>
      
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {interestCategories.map((category) => (
          <div key={category.category} className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-love font-semibold">
              {category.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map((interest) => {
                const isSelected = value.includes(interest);
                const isDisabled = !isSelected && value.length >= maxSelections;
                
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    disabled={isDisabled}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1.5",
                      isSelected 
                        ? "bg-love text-white" 
                        : "bg-island-light/20 text-white/80 hover:bg-island-light/30",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {value.length < 3 && (
        <p className="text-sm text-love-light">Select at least 3 interests to continue</p>
      )}
    </div>
  );
}

export default InterestsPicker;
