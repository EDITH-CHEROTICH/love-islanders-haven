
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  dob: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const age = differenceInYears(new Date(), date);
    return age >= 18;
  }, { message: "You must be at least 18 years old" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  show_age: z.boolean().default(true),
});

interface OnboardingBasicsProps {
  initialData: any;
  onNext: (data: any) => void;
  isSubmitting: boolean;
}

export const OnboardingBasics = ({ initialData, onNext, isSubmitting }: OnboardingBasicsProps) => {
  const [age, setAge] = useState(initialData?.age || 0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      dob: initialData?.dob ? new Date(initialData.dob) : undefined,
      gender: initialData?.gender || undefined,
      show_age: initialData?.show_age !== undefined ? initialData.show_age : true,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedAge = differenceInYears(new Date(), data.dob);
    
    // Format the data for the API
    const formattedData = {
      name: data.name,
      dob: data.dob.toISOString().split('T')[0], // Format as YYYY-MM-DD
      gender: data.gender,
      age: calculatedAge,
      show_age: data.show_age,
    };
    
    onNext(formattedData);
  };
  
  // Update age when date of birth changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const calculatedAge = differenceInYears(new Date(), date);
      setAge(calculatedAge);
      form.setValue("dob", date);
    }
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-6 text-gradient">Let's Get Started</h1>
      <p className="text-gray-300 mb-6">Tell us a bit about yourself to create your profile.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your name?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-island-light/20 border-island-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>When were you born?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-island-light/20 border-island-light",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => handleDateChange(date)}
                      disabled={(date) => 
                        date > new Date() || 
                        date < new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {age >= 18 && field.value && (
                  <p className="text-xs text-gray-400">You are {age} years old</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Man</SelectItem>
                    <SelectItem value="female">Woman</SelectItem>
                    <SelectItem value="other">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="show_age"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-island-light/30 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show my age</FormLabel>
                  <p className="text-sm text-gray-400">
                    Your age will be visible to potential matches
                  </p>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="accent-love h-6 w-6"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-love hover:bg-love-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
