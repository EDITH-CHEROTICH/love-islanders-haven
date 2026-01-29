import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  bio: z.string().min(20, { message: "Bio must be at least 20 characters" })
    .max(500, { message: "Bio must be 500 characters or less" }),
  relationship_goal: z.enum(["long_term", "short_term", "friends", "figuring_out"], {
    required_error: "Please select what you're looking for",
  }),
  communication_style: z.enum(["texting", "calling", "video_chat", "in_person"], {
    required_error: "Please select your style",
  }).optional(),
  love_language: z.enum(["words", "touch", "gifts", "time", "service"]).optional(),
  zodiac: z.string().optional(),
});

interface OnboardingPersonalityProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const OptionButton = ({ 
  value, 
  label, 
  selected, 
  onClick,
  emoji
}: { 
  value: string; 
  label: string; 
  selected: boolean; 
  onClick: () => void;
  emoji?: string;
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
    {emoji && <span className="mr-1">{emoji}</span>}
    {label}
  </button>
);

export const OnboardingPersonality = ({ initialData, onNext, onBack, isSubmitting }: OnboardingPersonalityProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: initialData?.bio || '',
      relationship_goal: initialData?.relationship_goal || undefined,
      communication_style: initialData?.communication_style || undefined,
      love_language: initialData?.love_language || undefined,
      zodiac: initialData?.zodiac_sign || initialData?.zodiac || undefined,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext({
      ...data,
      zodiac_sign: data.zodiac,
    });
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">About You</h1>
      <p className="text-gray-300 mb-6">Let potential matches know who you are.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About me</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What makes you unique? What are you passionate about? What's a perfect first date for you?"
                    className="bg-island-light/20 border-island-light resize-none h-28"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{field.value.length}/500 characters</span>
                  {field.value.length < 20 && (
                    <span className="text-love">At least 20 characters required</span>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Relationship Goal */}
          <FormField
            control={form.control}
            name="relationship_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I'm looking for</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'long_term', label: 'Long-term', emoji: '💍' },
                    { value: 'short_term', label: 'Short-term', emoji: '🎉' },
                    { value: 'friends', label: 'New friends', emoji: '👋' },
                    { value: 'figuring_out', label: 'Still figuring out', emoji: '🤔' },
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      emoji={option.emoji}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Communication Style */}
          <FormField
            control={form.control}
            name="communication_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I communicate best through</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'texting', label: 'Texting', emoji: '💬' },
                    { value: 'calling', label: 'Calling', emoji: '📞' },
                    { value: 'video_chat', label: 'Video chat', emoji: '📹' },
                    { value: 'in_person', label: 'In person', emoji: '☕' },
                  ].map((option) => (
                    <OptionButton
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      emoji={option.emoji}
                      selected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Love Language */}
          <FormField
            control={form.control}
            name="love_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>My love language is (optional)</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { value: 'words', label: 'Words of affirmation' },
                    { value: 'touch', label: 'Physical touch' },
                    { value: 'gifts', label: 'Receiving gifts' },
                    { value: 'time', label: 'Quality time' },
                    { value: 'service', label: 'Acts of service' },
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
          
          {/* Zodiac */}
          <FormField
            control={form.control}
            name="zodiac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zodiac sign (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-island-light/20 border-island-light">
                      <SelectValue placeholder="Select your sign" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aries">♈ Aries</SelectItem>
                    <SelectItem value="taurus">♉ Taurus</SelectItem>
                    <SelectItem value="gemini">♊ Gemini</SelectItem>
                    <SelectItem value="cancer">♋ Cancer</SelectItem>
                    <SelectItem value="leo">♌ Leo</SelectItem>
                    <SelectItem value="virgo">♍ Virgo</SelectItem>
                    <SelectItem value="libra">♎ Libra</SelectItem>
                    <SelectItem value="scorpio">♏ Scorpio</SelectItem>
                    <SelectItem value="sagittarius">♐ Sagittarius</SelectItem>
                    <SelectItem value="capricorn">♑ Capricorn</SelectItem>
                    <SelectItem value="aquarius">♒ Aquarius</SelectItem>
                    <SelectItem value="pisces">♓ Pisces</SelectItem>
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

export default OnboardingPersonality;
