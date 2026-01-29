import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  age_range_min: z.number().min(18).max(100),
  age_range_max: z.number().min(18).max(100),
  distance_preference: z.number().min(1).max(100),
  show_me_verified_only: z.boolean().optional(),
});

interface OnboardingPreferencesProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const OptionButton = ({ 
  label, 
  selected, 
  onClick,
}: { 
  label: string; 
  selected: boolean; 
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm transition-all",
      selected 
        ? "bg-love text-white" 
        : "bg-island-light/20 text-white/80 hover:bg-island-light/30"
    )}
  >
    {label}
  </button>
);

export const OnboardingPreferences = ({ initialData, onNext, onBack, isSubmitting }: OnboardingPreferencesProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age_range_min: initialData?.age_range_min || 18,
      age_range_max: initialData?.age_range_max || 35,
      distance_preference: initialData?.distance_preference || 25,
      show_me_verified_only: initialData?.show_me_verified_only || false,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext(data);
  };
  
  const ageMin = form.watch('age_range_min');
  const ageMax = form.watch('age_range_max');
  const distance = form.watch('distance_preference');
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Your Preferences</h1>
      <p className="text-gray-300 mb-6">Let us know who you'd like to meet.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Age Range</FormLabel>
              <span className="text-love font-medium">{ageMin} - {ageMax}</span>
            </div>
            
            <div className="px-2">
              <Slider
                min={18}
                max={100}
                step={1}
                value={[ageMin, ageMax]}
                onValueChange={([min, max]) => {
                  form.setValue('age_range_min', min);
                  form.setValue('age_range_max', max);
                }}
                className="[&_[role=slider]]:bg-love"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>18</span>
              <span>100+</span>
            </div>
          </div>
          
          {/* Distance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Maximum Distance</FormLabel>
              <span className="text-love font-medium">{distance} km</span>
            </div>
            
            <div className="px-2">
              <Slider
                min={1}
                max={100}
                step={1}
                value={[distance]}
                onValueChange={([val]) => form.setValue('distance_preference', val)}
                className="[&_[role=slider]]:bg-love"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>1 km</span>
              <span>100+ km</span>
            </div>
          </div>
          
          {/* Verified Only */}
          <FormField
            control={form.control}
            name="show_me_verified_only"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Show me</FormLabel>
                <div className="flex gap-3 pt-1">
                  <OptionButton
                    label="Everyone"
                    selected={!field.value}
                    onClick={() => field.onChange(false)}
                  />
                  <OptionButton
                    label="Verified profiles only"
                    selected={!!field.value}
                    onClick={() => field.onChange(true)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finishing...
                </>
              ) : "Complete Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingPreferences;
