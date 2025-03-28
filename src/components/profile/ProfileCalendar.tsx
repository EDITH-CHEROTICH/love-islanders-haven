// Update the import in ProfileCalendar.tsx
import React, { useState, useEffect } from 'react';
import { useProfileCalendar } from '@/hooks/use-profile-calendar';
import { Calendar as CalendarIcon, PlusCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

const ProfileCalendar = () => {
  const { 
    datePlans, 
    upcomingDates, 
    pastDates, 
    isLoading, 
    refresh,
    isGoogleAuthorized,
    initiateGoogleAuth
  } = useProfileCalendar();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  useEffect(() => {
    refresh();
  }, []);

  const handleGoogleAuth = async () => {
    if (!isGoogleAuthorized) {
      initiateGoogleAuth();
    } else {
      toast({
        title: "Already Authorized",
        description: "You are already authorized with Google Calendar.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p>Loading upcoming dates...</p>
          ) : upcomingDates.length > 0 ? (
            upcomingDates.map((datePlan) => (
              <div key={datePlan.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{datePlan.location}</h3>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(datePlan.date_time), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            ))
          ) : (
            <p>No upcoming dates planned.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Past Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p>Loading past dates...</p>
          ) : pastDates.length > 0 ? (
            pastDates.map((datePlan) => (
              <div key={datePlan.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{datePlan.location}</h3>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(datePlan.date_time), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <Badge variant="outline">Past</Badge>
              </div>
            ))
          ) : (
            <p>No past dates available.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            className="w-full bg-island-light/10 border-island-light/40"
            onClick={handleGoogleAuth}
          >
            <Share2 size={16} className="mr-2" />
            {isGoogleAuthorized ? 'Connected to Google Calendar' : 'Connect to Google Calendar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCalendar;
