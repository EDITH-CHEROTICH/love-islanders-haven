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
      
      // Filter out fields that don't exist in profiles table
      const profileFields = ['name', 'bio', 'age', 'location', 'interests', 'avatar_url', 'verified', 'email_verified'];
      const profileUpdate: any = {};
      
      for (const key of Object.keys(stepData)) {
        if (profileFields.includes(key)) {
          profileUpdate[key] = stepData[key];
        }
      }
      
      // Only update if there are valid profile fields
      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', profileData.id);
          
        if (updateError) {
          console.error('Profile update error:', updateError);
        }
      }
      
      const currentIndex = steps.indexOf(currentStep);
      const nextStep = steps[currentIndex + 1] as OnboardingStep;
      
      try {
        await updateOnboardingProgress({
          current_step: nextStep,
          completed: nextStep === 'completed'
        });
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
