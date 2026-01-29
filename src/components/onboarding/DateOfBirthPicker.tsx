import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DateOfBirthPickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minAge?: number;
  maxAge?: number;
}

const months = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export function DateOfBirthPicker({ 
  value, 
  onChange, 
  minAge = 18, 
  maxAge = 100 
}: DateOfBirthPickerProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;
  
  // Generate years array (from newest valid to oldest)
  const years = Array.from(
    { length: maxAge - minAge + 1 }, 
    (_, i) => maxYear - i
  );
  
  // Parse initial value
  const [selectedYear, setSelectedYear] = useState<string>(
    value ? value.getFullYear().toString() : ''
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    value ? value.getMonth().toString() : ''
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    value ? value.getDate().toString() : ''
  );
  
  // Calculate days in selected month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const daysInMonth = selectedYear && selectedMonth !== '' 
    ? getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth))
    : 31;
    
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Update parent when all fields are selected
  useEffect(() => {
    if (selectedYear && selectedMonth !== '' && selectedDay) {
      const date = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        parseInt(selectedDay)
      );
      onChange(date);
    } else {
      onChange(undefined);
    }
  }, [selectedYear, selectedMonth, selectedDay, onChange]);
  
  // Reset day if it exceeds days in new month
  useEffect(() => {
    if (selectedDay && parseInt(selectedDay) > daysInMonth) {
      setSelectedDay('');
    }
  }, [daysInMonth, selectedDay]);
  
  return (
    <div className="space-y-3">
      <Label className="text-white">When were you born?</Label>
      <div className="grid grid-cols-3 gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="bg-island-light/20 border-island-light text-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="bg-island-light/20 border-island-light text-white">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="bg-island-light/20 border-island-light text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {value && (
        <p className="text-sm text-muted-foreground">
          You'll be {currentYear - value.getFullYear()} years old
        </p>
      )}
    </div>
  );
}

export default DateOfBirthPicker;
