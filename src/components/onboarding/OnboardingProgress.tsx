import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'basics' | 'photos' | 'interests' | 'lifestyle' | 'personality' | 'preferences';

interface OnboardingProgressProps {
  currentStep: string;
  steps: string[];
  stepLabels?: Record<string, string>;
}

export const OnboardingProgress = ({ 
  currentStep, 
  steps,
  stepLabels = {}
}: OnboardingProgressProps) => {
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const label = stepLabels[step] || step.charAt(0).toUpperCase() + step.slice(1);
          
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Step indicator */}
              <div className="relative flex items-center justify-center w-full">
                {/* Connector line before */}
                {index > 0 && (
                  <div 
                    className={cn(
                      "absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2",
                      index <= currentIndex ? "bg-love" : "bg-island-light/30"
                    )} 
                  />
                )}
                
                {/* Connector line after */}
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2",
                      index < currentIndex ? "bg-love" : "bg-island-light/30"
                    )} 
                  />
                )}
                
                {/* Circle */}
                <div 
                  className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isCompleted 
                      ? "bg-love text-white" 
                      : isCurrent 
                        ? "bg-love text-white ring-4 ring-love/30" 
                        : "bg-island-light/20 text-gray-400 border border-island-light/30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
              
              {/* Step label */}
              <span 
                className={cn(
                  "mt-2 text-xs",
                  isCurrent ? "text-love font-medium" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
