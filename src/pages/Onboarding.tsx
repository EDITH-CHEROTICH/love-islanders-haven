import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingBasics } from '@/components/onboarding/OnboardingBasics';
import { OnboardingPhotos } from '@/components/onboarding/OnboardingPhotos';
import { OnboardingInterests } from '@/components/onboarding/OnboardingInterests';
import { OnboardingLifestyle } from '@/components/onboarding/OnboardingLifestyle';
import { OnboardingPersonality } from '@/components/onboarding/OnboardingPersonality';
import { OnboardingPreferences } from '@/components/onboarding/OnboardingPreferences';
import { OnboardingCompletion } from '@/components/onboarding/OnboardingCompletion';
import { updateOnboardingProgress } from '@/services/profiles/onboarding';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type OnboardingStep = 'basics' | 'photos' | 'interests' | 'lifestyle' | 'personality' | 'preferences' | 'completed';

const steps: OnboardingStep[] = ['basics', 'photos', 'interests', 'lifestyle', 'personality', 'preferences', 'completed'];

const stepLabels: Record<OnboardingStep, string> = {
  basics: 'Basics',
  photos: 'Photos',
  interests: 'Interests',
  lifestyle: 'Lifestyle',
  personality: 'Personality',
  preferences: 'Preferences',
  completed: 'Done'
};

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basics');
  const [profileData, setProfileData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login', { replace: true });
        return;
      }
      
      try {
        const { data: onboardingData } = await supabase
          .from('profile_onboarding')
          .select('*')
          .eq('profile_id', data.session.user.id)
          .single();
        
        if (onboardingData?.completed) {
          navigate('/discover', { replace: true });
          return;
        }
        
        if (onboardingData?.current_step) {
          setCurrentStep(onboardingData.current_step as OnboardingStep);
        }
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setProfileData({ ...profileData, id: data.session.user.id });
        } else {
          setProfileData({ id: data.session.user.id });
        }
      } catch (error) {
        console.error("Error loading onboarding data:", error);
        // Still allow continuing if no onboarding record exists
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          setProfileData({ id: user.user.id });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleNext = async (stepData: any) => {
    setIsSaving(true);
    
    try {
      const updatedProfileData = { ...profileData, ...stepData };
      setProfileData(updatedProfileData);
      
      // Whitelist of valid profile columns (matches DB schema)
      const profileFields = new Set([
        'name', 'display_name', 'bio', 'age', 'dob', 'gender', 'gender_preference',
        'location', 'city', 'country', 'hometown', 'pronouns', 'avatar_url',
        'interests', 'height_cm', 'occupation', 'education', 'exercise',
        'drinking_habit', 'smoking_habit', 'relationship_goal', 'communication_style',
        'love_language', 'zodiac_sign', 'age_range_min', 'age_range_max',
        'distance_preference', 'show_me_verified_only', 'show_age',
        'verified', 'email_verified', 'onboarding_completed',
      ]);
      const profileUpdate: any = {};
      for (const key of Object.keys(stepData)) {
        if (profileFields.has(key) && stepData[key] !== undefined) {
          profileUpdate[key] = stepData[key];
        }
      }

      const currentIndex = steps.indexOf(currentStep);
      const nextStep = steps[currentIndex + 1] as OnboardingStep;
      if (nextStep === 'completed') {
        profileUpdate.onboarding_completed = true;
      }

      if (Object.keys(profileUpdate).length > 0) {
        // Upsert to be safe in case the row doesn't exist yet
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: profileData.id, ...profileUpdate }, { onConflict: 'id' });

        if (upsertError) {
          console.error('Profile upsert error:', upsertError);
          throw upsertError;
        }
      }

      // Ensure onboarding tracking row exists, then update step
      try {
        await supabase
          .from('profile_onboarding')
          .upsert(
            { profile_id: profileData.id, current_step: nextStep, completed: nextStep === 'completed' },
            { onConflict: 'profile_id' }
          );
      } catch (onboardingError) {
        console.error('Onboarding progress update error:', onboardingError);
      }
      
      setCurrentStep(nextStep);
      
      if (nextStep === 'completed') {
        toast({
          title: "Profile Completed! 🎉",
          description: "You're ready to start meeting people.",
        });
        
        // Redirect immediately after showing toast
        setTimeout(() => {
          navigate('/discover', { replace: true });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error Saving Data",
        description: error.message || "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBack = async () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1] as OnboardingStep;
      setCurrentStep(previousStep);
      
      try {
        await updateOnboardingProgress({
          current_step: previousStep
        });
      } catch (error) {
        console.error('Error updating onboarding progress:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-island-dark">
        <Loader2 className="h-12 w-12 animate-spin text-love" />
      </div>
    );
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 'basics':
        return <OnboardingBasics 
          initialData={profileData} 
          onNext={handleNext} 
          isSubmitting={isSaving}
        />;
      case 'photos':
        return <OnboardingPhotos 
          profileId={profileData.id} 
          onNext={handleNext} 
          onBack={handleBack}
          isSubmitting={isSaving}
        />;
      case 'interests':
        return <OnboardingInterests
          initialData={profileData}
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={isSaving}
        />;
      case 'lifestyle':
        return <OnboardingLifestyle 
          initialData={profileData} 
          onNext={handleNext} 
          onBack={handleBack}
          isSubmitting={isSaving}
        />;
      case 'personality':
        return <OnboardingPersonality 
          initialData={profileData} 
          onNext={handleNext} 
          onBack={handleBack}
          isSubmitting={isSaving}
        />;
      case 'preferences':
        return <OnboardingPreferences 
          initialData={profileData} 
          onNext={handleNext} 
          onBack={handleBack}
          isSubmitting={isSaving}
        />;
      case 'completed':
        return <OnboardingCompletion />;
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-island-dark via-island to-island-dark overflow-y-auto z-50">
      <div className="container max-w-md mx-auto px-4 py-8 pb-16">
        <OnboardingProgress 
          currentStep={currentStep} 
          steps={steps.filter(step => step !== 'completed')}
          stepLabels={stepLabels}
        />
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
