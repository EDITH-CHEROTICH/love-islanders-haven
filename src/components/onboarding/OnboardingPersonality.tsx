
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

const formSchema = z.object({
  bio: z.string().max(500, { message: "Bio must be 500 characters or less" })
    .refine(bio => bio.length >= 20, { message: "Bio must be at least 20 characters" }),
  zodiac_sign: z.string().optional(),
  religion: z.string().optional(),
  political_view: z.string().optional(),
});

interface OnboardingPersonalityProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OnboardingPersonality = ({ initialData, onNext, onBack, isSubmitting }: OnboardingPersonalityProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: initialData?.bio || '',
      zodiac_sign: initialData?.zodiac_sign || undefined,
      religion: initialData?.religion || undefined,
      political_view: initialData?.political_view || undefined,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext(data);
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">About You</h1>
      <p className="text-gray-300 mb-6">Share more about your personality, beliefs and interests.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write something interesting about yourself..."
                    className="bg-island-light/20 border-island-light resize-none h-28"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  {field.value.length}/500 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zodiac_sign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zodiac Sign</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your zodiac sign (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aries">Aries</SelectItem>
                    <SelectItem value="taurus">Taurus</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="cancer">Cancer</SelectItem>
                    <SelectItem value="leo">Leo</SelectItem>
                    <SelectItem value="virgo">Virgo</SelectItem>
                    <SelectItem value="libra">Libra</SelectItem>
                    <SelectItem value="scorpio">Scorpio</SelectItem>
                    <SelectItem value="sagittarius">Sagittarius</SelectItem>
                    <SelectItem value="capricorn">Capricorn</SelectItem>
                    <SelectItem value="aquarius">Aquarius</SelectItem>
                    <SelectItem value="pisces">Pisces</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your religion (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="agnostic">Agnostic</SelectItem>
                    <SelectItem value="atheist">Atheist</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                    <SelectItem value="catholic">Catholic</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="jewish">Jewish</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="spiritual">Spiritual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="political_view"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Political Views</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your political view (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="liberal">Liberal</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="not_political">Not Political</SelectItem>
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
