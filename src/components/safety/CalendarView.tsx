
import React, { useState, useEffect } from 'react';
import { format, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useDatingSafety, type DatePlan } from '@/hooks/use-dating-safety';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { datePlans, fetchDatePlans } = useDatingSafety();
  const [filteredPlans, setFilteredPlans] = useState<DatePlan[]>([]);
  
  // Fetch date plans when component mounts
  useEffect(() => {
    fetchDatePlans();
  }, [fetchDatePlans]);
  
  // Filter date plans for the selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = datePlans.filter(plan => {
        const planDate = new Date(plan.date_time);
        return isSameDay(planDate, selectedDate);
      });
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans([]);
    }
  }, [selectedDate, datePlans]);
  
  // Function to check if a date has plans
  const hasDatePlans = (date: Date) => {
    return datePlans.some(plan => {
      const planDate = new Date(plan.date_time);
      return isSameDay(planDate, date);
    });
  };
  
  // Custom day render for the calendar
  const renderDay = (day: Date) => {
    const hasPlans = hasDatePlans(day);
    return hasPlans ? (
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div className="absolute bottom-1 right-1">
          <div className="h-2 w-2 rounded-full bg-love"></div>
        </div>
      </div>
    ) : null;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Date Calendar</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(date, 'MMMM yyyy')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={date}
              onMonthChange={setDate}
              components={{
                DayContent: ({ date }) => renderDay(date),
              }}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Plans for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPlans.length > 0 ? (
              <ul className="space-y-2">
                {filteredPlans.map((plan) => (
                  <li key={plan.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{plan.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(plan.date_time), 'h:mm a')}
                        </p>
                      </div>
                      {plan.location_sharing_enabled && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Location Sharing
                        </Badge>
                      )}
                    </div>
                    {plan.notes && (
                      <p className="text-sm mt-2 text-muted-foreground">{plan.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No date plans for this day.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
