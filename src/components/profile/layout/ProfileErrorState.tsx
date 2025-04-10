
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ProfileErrorStateProps {
  onRetry: () => void;
  errorMessage?: string;
}

const ProfileErrorState = ({ onRetry, errorMessage }: ProfileErrorStateProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  // Monitor online status - especially important for mobile
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Attempt auto retry when coming back online
  useEffect(() => {
    if (isOnline && retryAttempt > 0) {
      onRetry();
    }
  }, [isOnline, retryAttempt]);
  
  // Attempt auth refresh - this is a non-blocking action
  const attemptAuthRefresh = () => {
    // Try to refresh auth state from localStorage
    if (localStorage.getItem('isAuthenticated') === 'true') {
      console.log('Attempting auth refresh from localStorage');
    }
    
    // Set retry attempt count
    setRetryAttempt(prev => prev + 1);
    
    // Call the main retry function
    onRetry();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container pt-8 space-y-6">
        <div className="flex items-center justify-center mb-4">
          {isOnline ? <Wifi className="text-green-500 h-8 w-8" /> : <WifiOff className="text-red-500 h-8 w-8" />}
          <span className="ml-2 text-sm">
            {isOnline ? "Connected" : "No Internet Connection"}
          </span>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {errorMessage || "Unable to load profile data. Please try again when you have better connectivity."}
          </AlertDescription>
        </Alert>
        
        <div className="text-center text-sm text-muted-foreground mt-2">
          <p>This could be due to:</p>
          <ul className="list-disc list-inside mt-1 mb-4">
            <li>A temporary connection issue</li>
            <li>Your device might be offline</li>
            <li>Your session may have expired</li>
            <li>The server might be experiencing problems</li>
          </ul>
          
          {!isOnline && (
            <p className="text-amber-400 font-medium mt-2 mb-4">
              You appear to be offline. Please connect to the internet and try again.
            </p>
          )}
          
          <p className="text-xs text-love mt-2">
            For development purposes, data will be loaded from default values.
          </p>
        </div>
        
        <Button 
          onClick={attemptAuthRefresh}
          className="w-full flex items-center justify-center space-x-2"
          variant={isOnline ? "default" : "outline"}
          disabled={!isOnline && retryAttempt > 0}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>{isOnline ? "Retry Now" : "Retry When Online"}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
