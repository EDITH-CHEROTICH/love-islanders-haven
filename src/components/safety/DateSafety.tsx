
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Shield } from 'lucide-react';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import CalendarView from './CalendarView';
import EmergencyButton from './EmergencyButton';
import DatePlanForm from './DatePlanForm';
import SafetyContactForm from './SafetyContactForm';

interface DateSafetyProps {
  matchId: string;
  matchName: string;
}

const DateSafety = ({ matchId, matchName }: DateSafetyProps) => {
  const { fetchDatePlans } = useDatingSafety();
  const [activeTab, setActiveTab] = useState("create");
  
  // Fetch dates when component mounts
  useEffect(() => {
    fetchDatePlans();
  }, [fetchDatePlans]);
  
  return (
    <Card className="bg-background/80 backdrop-blur-sm shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-love" />
            Dating Safety Features
          </CardTitle>
          <CardDescription>
            Plan safe dates and share your plans with trusted contacts
          </CardDescription>
        </div>
        <EmergencyButton />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <DatePlanForm matchName={matchName} />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
          <div>
            Your safety is our priority. We'll send you reminders before your date 
            and check in with you during and after your date.
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DateSafety;
