
import { Check } from 'lucide-react';

export const OnboardingCompletion = () => {
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30 flex flex-col items-center py-12">
      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-gradient text-center">Profile Complete!</h1>
      
      <p className="text-gray-300 mb-6 text-center">
        You're all set! Your dating profile has been created and you're ready to start exploring matches.
      </p>
      
      <div className="bg-island-light/10 rounded-lg p-4 mb-6 w-full">
        <h3 className="text-lg font-medium mb-2">What happens next?</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="mr-2 bg-green-500 rounded-full p-0.5 mt-0.5">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">Browse profiles in the Discover section</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 bg-green-500 rounded-full p-0.5 mt-0.5">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">Like profiles that interest you</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 bg-green-500 rounded-full p-0.5 mt-0.5">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">Start conversations when you match</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 bg-green-500 rounded-full p-0.5 mt-0.5">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">Edit your profile anytime in Settings</span>
          </li>
        </ul>
      </div>
      
      <div className="flex items-center justify-center w-full">
        <div className="animate-pulse flex flex-col items-center">
          <p className="text-sm text-gray-400">Redirecting you to discover...</p>
          <div className="mt-2 w-16 h-1 bg-love rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
