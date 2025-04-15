
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

const formSchema = z.object({
  gender_preference: z.enum(["male", "female", "both"], {
    required_error: "Please select your preference",
  }),
  relationship_goal: z.enum(["long-term", "casual", "both"], {
    required_error: "Please select your goal",
  }),
  looking_for: z.string().optional(),
});

interface OnboardingPreferencesProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OnboardingPreferences = ({ initialData, onNext, onBack, isSubmitting }: OnboardingPreferencesProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender_preference: initialData?.gender_preference || "both",
      relationship_goal: initialData?.relationship_goal || "both",
      looking_for: initialData?.looking_for || undefined,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext(data);
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Your Preferences</h1>
      <p className="text-gray-300 mb-6">Let us know what you're looking for to find better matches.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="gender_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I want to see</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select who you want to see" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Men</SelectItem>
                    <SelectItem value="female">Women</SelectItem>
                    <SelectItem value="both">Everyone</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="relationship_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I'm looking for</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your relationship goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="long-term">Long-term relationship</SelectItem>
                    <SelectItem value="casual">Casual dating</SelectItem>
                    <SelectItem value="both">Open to either</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="looking_for"
            render={({ field }) => (
              <FormItem>
                <FormLabel>More specifically, I'm looking for</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select what you're looking for (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dating">Dating</SelectItem>
                    <SelectItem value="relationship">Relationship</SelectItem>
                    <SelectItem value="marriage">Marriage & Family</SelectItem>
                    <SelectItem value="friends">Making friends</SelectItem>
                    <SelectItem value="not_sure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
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
