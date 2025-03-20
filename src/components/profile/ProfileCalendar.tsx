
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useProfileCalendar } from '@/hooks/use-profile-calendar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProfileCalendar = () => {
  const { upcomingDates, pastDates, isLoading, refresh } = useProfileCalendar();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Authentication Required</CardTitle>
          <CardDescription>
            Please log in to view and manage your date plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full"
          >
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const renderDatePlan = (plan: any) => {
    const dateTime = new Date(plan.date_time);
    return (
      <Card key={plan.id} className="mb-4 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{format(dateTime, 'EEEE, MMMM d, yyyy')}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{format(dateTime, 'h:mm a')}</span>
              </div>
            </div>
            {plan.location_sharing_enabled && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Location Sharing
              </Badge>
            )}
          </div>
          
          <div className="flex items-start mt-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
            <div>
              <p className="text-sm">{plan.location}</p>
              {plan.notes && <p className="text-xs text-muted-foreground mt-1">{plan.notes}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Date Calendar
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/messages')}
        >
          Plan New Date
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingDates.length > 0 ? (
            <div>
              {upcomingDates.map(renderDatePlan)}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No upcoming dates</CardTitle>
                <CardDescription>
                  When you plan a date with someone, it will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/messages')} 
                  className="w-full"
                >
                  Start Planning a Date
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          {pastDates.length > 0 ? (
            <div>
              {pastDates.map(renderDatePlan)}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No past dates</CardTitle>
                <CardDescription>
                  Your dating history will be shown here.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileCalendar;
