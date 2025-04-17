
import React from 'react';

type Step = 'basics' | 'photos' | 'lifestyle' | 'personality' | 'preferences';

interface OnboardingProgressProps {
  steps: Step[];
  currentStep: string;
}

export const OnboardingProgress = ({ steps, currentStep }: OnboardingProgressProps) => {
  const currentIndex = steps.indexOf(currentStep as Step);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${index <= currentIndex 
                    ? 'bg-love text-white' 
                    : 'bg-island-light/50 text-island-light'}`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${index <= currentIndex ? 'text-white' : 'text-island-light'}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-1 
                  ${index < currentIndex 
                    ? 'bg-love' 
                    : 'bg-island-light/50'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OnboardingProgress;
