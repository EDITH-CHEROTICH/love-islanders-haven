
import { Fragment } from 'react';

interface OnboardingProgressProps {
  currentStep: string;
  steps: string[];
}

export const OnboardingProgress = ({ currentStep, steps }: OnboardingProgressProps) => {
  const getStepLabel = (step: string) => {
    switch(step) {
      case 'basics': return 'Basics';
      case 'photos': return 'Photos';
      case 'lifestyle': return 'Lifestyle';
      case 'personality': return 'About You';
      case 'preferences': return 'Preferences';
      default: return step.charAt(0).toUpperCase() + step.slice(1);
    }
  };
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === step 
                    ? 'bg-love text-white' 
                    : (steps.indexOf(currentStep) > index) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                }`}
              >
                {steps.indexOf(currentStep) > index ? '✓' : (index + 1)}
              </div>
              <span className="text-xs mt-1 text-white">{getStepLabel(step)}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${
                steps.indexOf(currentStep) > index 
                  ? 'bg-green-500' 
                  : 'bg-gray-700'
              }`} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
