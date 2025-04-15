
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

const formSchema = z.object({
  education: z.string().optional(),
  occupation: z.string().min(1, { message: "Please enter your occupation" }),
  drinking_habit: z.enum(["never", "socially", "frequently", "prefer_not_to_say"], {
    required_error: "Please select an option",
  }),
  smoking_habit: z.enum(["never", "socially", "regularly", "prefer_not_to_say"], {
    required_error: "Please select an option",
  }),
  children_status: z.enum(["have", "dont_have_and_want", "dont_have_and_dont_want", "prefer_not_to_say"], {
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
      education: initialData?.education || undefined,
      occupation: initialData?.occupation || '',
      drinking_habit: initialData?.drinking_habit || undefined,
      smoking_habit: initialData?.smoking_habit || undefined,
      children_status: initialData?.children_status || undefined,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext(data);
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Lifestyle</h1>
      <p className="text-gray-300 mb-6">Share details about your lifestyle to help find better matches.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="college">In College</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate Degree</SelectItem>
                    <SelectItem value="graduate">Graduate Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="What do you do?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="arts">Arts & Entertainment</SelectItem>
                    <SelectItem value="trades">Skilled Trades</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="drinking_habit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drinking</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Do you drink?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="socially">Socially</SelectItem>
                    <SelectItem value="frequently">Frequently</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="smoking_habit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Smoking</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Do you smoke?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="socially">Socially</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="children_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Children</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="have">Have children</SelectItem>
                    <SelectItem value="dont_have_and_want">Don't have but want someday</SelectItem>
                    <SelectItem value="dont_have_and_dont_want">Don't have and don't want</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
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
