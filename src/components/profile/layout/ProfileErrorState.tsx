
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProfileErrorStateProps {
  onRetry: () => void;
}

const ProfileErrorState = ({ onRetry }: ProfileErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container pt-8 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load profile data. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="text-center text-sm text-muted-foreground mt-2">
          <p>This could be due to:</p>
          <ul className="list-disc list-inside mt-1 mb-4">
            <li>A temporary connection issue</li>
            <li>Your session may have expired</li>
            <li>The server might be experiencing problems</li>
          </ul>
        </div>
        <Button 
          onClick={onRetry}
          className="w-full"
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
