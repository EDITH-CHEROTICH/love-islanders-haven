
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingBasics } from '@/components/onboarding/OnboardingBasics';
import { OnboardingPhotos } from '@/components/onboarding/OnboardingPhotos';
import { OnboardingLifestyle } from '@/components/onboarding/OnboardingLifestyle';
import { OnboardingPersonality } from '@/components/onboarding/OnboardingPersonality';
import { OnboardingPreferences } from '@/components/onboarding/OnboardingPreferences';
import { OnboardingCompletion } from '@/components/onboarding/OnboardingCompletion';
import { updateOnboardingProgress } from '@/services/profiles/onboarding';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type OnboardingStep = 'basics' | 'photos' | 'lifestyle' | 'personality' | 'preferences' | 'completed';

const steps: OnboardingStep[] = ['basics', 'photos', 'lifestyle', 'personality', 'preferences', 'completed'];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basics');
  const [profileData, setProfileData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login', { replace: true });
        return;
      }
      
      // Check for existing onboarding progress
      try {
        const { data: onboardingData } = await supabase
          .from('profile_onboarding')
          .select('*')
          .eq('profile_id', data.session.user.id)
          .single();
        
        // If onboarding exists and is completed, redirect to discover
        if (onboardingData?.completed) {
          navigate('/discover', { replace: true });
          return;
        }
        
        // If onboarding exists and has a current step, set it
        if (onboardingData?.current_step) {
          setCurrentStep(onboardingData.current_step as OnboardingStep);
        }
        
        // Get existing profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setProfileData(profileData);
        }
      } catch (error) {
        console.error("Error loading onboarding data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleNext = async (stepData: any) => {
    setIsSaving(true);
    
    try {
      // Update profile data state
      const updatedProfileData = { ...profileData, ...stepData };
      setProfileData(updatedProfileData);
      
      // Save data to Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update(stepData)
        .eq('id', profileData.id);
        
      if (updateError) throw updateError;
      
      // Find next step index
      const currentIndex = steps.indexOf(currentStep);
      const nextStep = steps[currentIndex + 1] as OnboardingStep;
      
      // Update onboarding progress
      const completedSteps = [...(profileData.completed_steps || []), currentStep];
      await updateOnboardingProgress({
        current_step: nextStep,
        completed_steps: completedSteps,
        completed: nextStep === 'completed'
      });
      
      // Move to next step
      setCurrentStep(nextStep);
      
      if (nextStep === 'completed') {
        toast({
          title: "Profile Completed!",
          description: "Your dating profile has been set up successfully.",
        });
        
        // Redirect to discover page after a delay
        setTimeout(() => {
          navigate('/discover', { replace: true });
        }, 3000);
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
      
      // Update onboarding progress
      await updateOnboardingProgress({
        current_step: previousStep
      });
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-island-dark">
        <Loader2 className="h-12 w-12 animate-spin text-love" />
      </div>
    );
  }
  
  // Render the current step
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
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark py-8">
      <div className="container max-w-md mx-auto px-4">
        <OnboardingProgress 
          currentStep={currentStep} 
          steps={steps.filter(step => step !== 'completed')} 
        />
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
