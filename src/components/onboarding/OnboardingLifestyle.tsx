import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  height: z.string().optional(),
  occupation: z.string().min(1, { message: "Please enter your occupation" }),
  education: z.string().optional(),
  exercise: z.enum(["active", "sometimes", "rarely", "never"], {
    required_error: "Please select an option",
  }),
  drinking: z.enum(["never", "socially", "frequently"], {
    required_error: "Please select an option",
  }),
  smoking: z.enum(["never", "socially", "regularly"], {
    required_error: "Please select an option",
  }),
});

interface OnboardingLifestyleProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OnboardingLifestyle = ({ initialData, onNext, onBack, isSubmitting }: OnboardingLifestyleProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: initialData?.height || '',
      occupation: initialData?.occupation || '',
      education: initialData?.education || undefined,
      exercise: initialData?.exercise || undefined,
      drinking: initialData?.drinking_habit || initialData?.drinking || undefined,
      smoking: initialData?.smoking_habit || initialData?.smoking || undefined,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext({
      ...data,
      drinking_habit: data.drinking,
      smoking_habit: data.smoking,
    });
  };
  
  // Option button component for visual selection
  const OptionButton = ({ 
    value, 
    label, 
    selected, 
    onClick 
  }: { 
    value: string; 
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
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Lifestyle</h1>
      <p className="text-gray-300 mb-6">Share a bit about how you live.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 5ft 10in or 178cm"
                    className="bg-island-light/20 border-island-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Occupation */}
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you do?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your job title or occupation"
                    className="bg-island-light/20 border-island-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Education */}
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="in_college">In College</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                    <SelectItem value="trade_school">Trade School</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Exercise */}
          <FormField
            control={form.control}
            name="exercise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you work out?</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'active', label: 'Active' },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'never', label: 'Never' },
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Drinking */}
          <FormField
            control={form.control}
            name="drinking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you drink?</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'never', label: 'Never' },
                    { value: 'socially', label: 'Socially' },
                    { value: 'frequently', label: 'Frequently' },
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Smoking */}
          <FormField
            control={form.control}
            name="smoking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you smoke?</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'never', label: 'Never' },
                    { value: 'socially', label: 'Socially' },
                    { value: 'regularly', label: 'Regularly' },
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
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
                  Saving...
                </>
              ) : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingLifestyle;
