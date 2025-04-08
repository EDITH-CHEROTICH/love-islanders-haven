
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ProfileCalendar from '@/components/profile/ProfileCalendar';

const ProfileCalendarContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Date Planning</AlertTitle>
        <AlertDescription>
          Plan your dates and set up safety measures for when you meet someone.
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={() => navigate('/settings')} 
        className="w-full"
        variant="outline"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Safety Features
      </Button>
      
      <ProfileCalendar />
    </div>
  );
};

export default ProfileCalendarContent;
