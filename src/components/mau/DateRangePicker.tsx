
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "@/types/mauTypes";
import { DatePickerCalendar } from "./DatePickerCalendar";
import { DateTimeInputs } from "./DateTimeInputs";
import { formatDateRange } from "@/utils/dateFormatters";

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
  const [isOpen, setIsOpen] = useState(false);
  
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
      updateDateRangeWithHours(fromHour, fromPeriod, toHour, toPeriod, range);
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
    toPeriodValue: 'AM' | 'PM',
    baseRange?: DateRange
  ) => {
    if ((baseRange || localDateRange)?.from && (baseRange || localDateRange)?.to) {
      const rangeToUse = baseRange || localDateRange;
      const newRange = {
        from: new Date(rangeToUse!.from!),
        to: new Date(rangeToUse!.to!)
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
      
      // Change time range to custom if callback provided
      if (baseRange && onTimeRangeTypeChange) {
        onTimeRangeTypeChange();
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          {isSelected ? formatDateRange(dateRange) : "Custom"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <DatePickerCalendar 
            localDateRange={localDateRange} 
            onDateRangeChange={handleDateRangeChange} 
          />
          <DateTimeInputs 
            fromHour={fromHour}
            fromPeriod={fromPeriod}
            toHour={toHour}
            toPeriod={toPeriod}
            handleFromHourChange={handleFromHourChange}
            handleToHourChange={handleToHourChange}
            handleFromPeriodChange={handleFromPeriodChange}
            handleToPeriodChange={handleToPeriodChange}
          />
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                if (localDateRange?.from && localDateRange?.to) {
                  setIsOpen(false);
                }
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
