import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, isSameYear } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "@/types/mauTypes";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange) => void;
  isSelected?: boolean;
  onTimeRangeTypeChange?: () => void;
}

export const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
  isSelected = false,
  onTimeRangeTypeChange
}: DateRangePickerProps) => {
  // Local state for date range
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(dateRange);
  
  // Local state for custom hours and period
  const [fromHour, setFromHour] = useState<string>(dateRange?.from ? format(dateRange.from, 'h') : '12');
  const [fromPeriod, setFromPeriod] = useState<'AM' | 'PM'>(dateRange?.from ? (dateRange.from.getHours() >= 12 ? 'PM' : 'AM') : 'AM');
  const [toHour, setToHour] = useState<string>(dateRange?.to ? format(dateRange.to, 'h') : '11');
  const [toPeriod, setToPeriod] = useState<'AM' | 'PM'>(dateRange?.to ? (dateRange.to.getHours() >= 12 ? 'PM' : 'AM') : 'PM');
  
  // Update local state when props change
  useEffect(() => {
    setLocalDateRange(dateRange);
    if (dateRange?.from) {
      setFromHour(format(dateRange.from, 'h'));
      setFromPeriod(dateRange.from.getHours() >= 12 ? 'PM' : 'AM');
    }
    if (dateRange?.to) {
      setToHour(format(dateRange.to, 'h'));
      setToPeriod(dateRange.to.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, [dateRange]);

  // Handle date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) return;
    
    setLocalDateRange(range);
    
    // If both dates are selected, apply hours and update
    if (range.from && range.to) {
      const newRange = {
        from: new Date(range.from),
        to: new Date(range.to)
      };
      
      // Set hours for from date (convert from 12-hour to 24-hour)
      const fromHourValue = parseInt(fromHour, 10);
      const fromHour24 = fromPeriod === 'AM' 
        ? (fromHourValue === 12 ? 0 : fromHourValue) 
        : (fromHourValue === 12 ? 12 : fromHourValue + 12);
      newRange.from.setHours(fromHour24, 0, 0, 0);
      
      // Set hours for to date (convert from 12-hour to 24-hour)
      const toHourValue = parseInt(toHour, 10);
      const toHour24 = toPeriod === 'AM' 
        ? (toHourValue === 12 ? 0 : toHourValue) 
        : (toHourValue === 12 ? 12 : toHourValue + 12);
      newRange.to.setHours(toHour24, 59, 59, 999);
      
      onDateRangeChange(newRange);
      
      // Change time range to custom if callback provided
      if (onTimeRangeTypeChange) {
        onTimeRangeTypeChange();
      }
    }
  };
  
  // Handle hour changes
  const handleFromHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = event.target.value;
    
    // Validate hour input (1-12)
    const hourNum = parseInt(newHour, 10);
    if (isNaN(hourNum) || hourNum < 1) {
      newHour = '1';
    } else if (hourNum > 12) {
      newHour = '12';
    }
    
    setFromHour(newHour);
    
    // Update date range with new hour if we have a selected range
    updateDateRangeWithHours(newHour, fromPeriod, toHour, toPeriod);
  };
  
  const handleToHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = event.target.value;
    
    // Validate hour input (1-12)
    const hourNum = parseInt(newHour, 10);
    if (isNaN(hourNum) || hourNum < 1) {
      newHour = '1';
    } else if (hourNum > 12) {
      newHour = '12';
    }
    
    setToHour(newHour);
    
    // Update date range with new hour if we have a selected range
    updateDateRangeWithHours(fromHour, fromPeriod, newHour, toPeriod);
  };
  
  // Handle period changes (AM/PM)
  const handleFromPeriodChange = (value: string) => {
    const period = value as 'AM' | 'PM';
    setFromPeriod(period);
    updateDateRangeWithHours(fromHour, period, toHour, toPeriod);
  };
  
  const handleToPeriodChange = (value: string) => {
    const period = value as 'AM' | 'PM';
    setToPeriod(period);
    updateDateRangeWithHours(fromHour, fromPeriod, toHour, period);
  };
  
  // Helper function to update date range with hours
  const updateDateRangeWithHours = (
    fromHourValue: string, 
    fromPeriodValue: 'AM' | 'PM', 
    toHourValue: string, 
    toPeriodValue: 'AM' | 'PM'
  ) => {
    if (localDateRange?.from && localDateRange?.to) {
      const newRange = {
        from: new Date(localDateRange.from),
        to: new Date(localDateRange.to)
      };
      
      // Convert from 12-hour to 24-hour format
      const fromHour12 = parseInt(fromHourValue, 10);
      const fromHour24 = fromPeriodValue === 'AM' 
        ? (fromHour12 === 12 ? 0 : fromHour12) 
        : (fromHour12 === 12 ? 12 : fromHour12 + 12);
      
      const toHour12 = parseInt(toHourValue, 10);
      const toHour24 = toPeriodValue === 'AM' 
        ? (toHour12 === 12 ? 0 : toHour12) 
        : (toHour12 === 12 ? 12 : toHour12 + 12);
      
      newRange.from.setHours(fromHour24, 0, 0, 0);
      newRange.to.setHours(toHour24, 59, 59, 999);
      
      onDateRangeChange(newRange);
    }
  };

  // Format date range for display - now with conditional year display
  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      // Check if both dates are in the same year
      const sameYear = isSameYear(dateRange.from, dateRange.to);
      // Check if dates are in current year
      const isCurrentYear = isSameYear(dateRange.from, new Date()) && isSameYear(dateRange.to, new Date());
      
      if (sameYear && isCurrentYear) {
        // If same year and current year, don't show year in the display
        return `${format(dateRange.from, "MMM d, h:mm a")} - ${format(dateRange.to, "MMM d, h:mm a")}`;
      } else if (sameYear) {
        // If same year but not current year, show year only once at the end
        return `${format(dateRange.from, "MMM d, h:mm a")} - ${format(dateRange.to, "MMM d, h:mm a, yyyy")}`;
      } else {
        // If different years, show years for both dates
        return `${format(dateRange.from, "MMM d, yyyy, h:mm a")} - ${format(dateRange.to, "MMM d, yyyy, h:mm a")}`;
      }
    }
    return "Select Date Range";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={isSelected ? 'default' : 'outline'}
          className={`rounded-r-none ${
            isSelected 
              ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
              : ''
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isSelected ? formatDateRange() : "Select Date Range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-1 mb-1">
            <p className="text-center font-semibold">
              {localDateRange?.from ? format(localDateRange.from, "MMMM yyyy") : "Select date"}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Double-click to change starting date
            </p>
          </div>
          <Calendar
            mode="range"
            selected={localDateRange}
            onSelect={handleDateRangeChange}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">From Time:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={fromHour}
                  onChange={handleFromHourChange}
                  className="w-16"
                />
                <Select value={fromPeriod} onValueChange={handleFromPeriodChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">To Time:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={toHour}
                  onChange={handleToHourChange}
                  className="w-16"
                />
                <Select value={toPeriod} onValueChange={handleToPeriodChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
