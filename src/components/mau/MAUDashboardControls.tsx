
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange, TimeRangeType } from "@/hooks/useMAUData";
import { ProjectSelector } from "@/components/mau/ProjectSelector";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MAUDashboardControlsProps {
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: TimeRangeType;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onChartTypeChange: (value: 'area' | 'bar' | 'line') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: TimeRangeType) => void;
  hideModeToggle?: boolean;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
}

export const MAUDashboardControls = ({
  viewType,
  chartType,
  selectedMonth,
  sortDirection,
  timeRange,
  selectedProject,
  setSelectedProject,
  onViewTypeChange,
  onChartTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange,
  hideModeToggle = false,
  customDateRange,
  onCustomDateRangeChange
}: MAUDashboardControlsProps) => {
  // Local state for custom hours and period
  const [fromHour, setFromHour] = useState<string>(customDateRange?.from ? format(customDateRange.from, 'h') : '12');
  const [fromPeriod, setFromPeriod] = useState<'AM' | 'PM'>(customDateRange?.from ? (customDateRange.from.getHours() >= 12 ? 'PM' : 'AM') : 'AM');
  const [toHour, setToHour] = useState<string>(customDateRange?.to ? format(customDateRange.to, 'h') : '11');
  const [toPeriod, setToPeriod] = useState<'AM' | 'PM'>(customDateRange?.to ? (customDateRange.to.getHours() >= 12 ? 'PM' : 'AM') : 'PM');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(customDateRange);
  
  // Generate abbreviated month options with year
  const getMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i);
      return {
        value: i.toString(),
        label: format(date, "MMM ''yy") // Format as "Jan '24"
      };
    });
  };

  const monthOptions = getMonthOptions();

  // Handle date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) return;
    
    setDateRange(range);
    
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
      
      if (onCustomDateRangeChange) {
        onCustomDateRangeChange(newRange);
      }
      
      // Set time range to custom
      onTimeRangeChange('custom');
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
    if (dateRange?.from && dateRange?.to && onCustomDateRangeChange) {
      const newRange = {
        from: new Date(dateRange.from),
        to: new Date(dateRange.to)
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
      
      onCustomDateRangeChange(newRange);
    }
  };

  // Format date range for display
  const formatDateRange = () => {
    if (customDateRange?.from && customDateRange?.to) {
      return `${format(customDateRange.from, "MMM d, yyyy h:mm a")} - ${format(customDateRange.to, "MMM d, yyyy h:mm a")}`;
    }
    return "Custom Date Range";
  };

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
      <ProjectSelector 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      
      <div className="flex">
        {/* Custom Date Range Picker with Hours */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={timeRange === 'custom' ? 'default' : 'outline'}
              className={`rounded-r-none ${
                timeRange === 'custom' 
                  ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                  : ''
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {timeRange === 'custom' ? formatDateRange() : "Custom Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <Calendar
                mode="range"
                selected={dateRange}
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
                onClick={() => onTimeRangeChange('month-to-date')}
                className={`rounded-none border-l-0 ${
                  timeRange === 'month-to-date' 
                    ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''
                }`}
              >
                MTD
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Month-to-date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={timeRange === 'rolling-30-day' ? 'default' : 'outline'}
                onClick={() => onTimeRangeChange('rolling-30-day')}
                className={`rounded-none border-l-0 ${
                  timeRange === 'rolling-30-day' 
                    ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''
                }`}
              >
                30D
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rolling 30-day Avg.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
                onClick={() => onTimeRangeChange('last-12-months')}
                className={`rounded-l-none border-l-0 ${
                  timeRange === 'last-12-months' 
                    ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''
                }`}
              >
                12M
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last 12 Months</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {timeRange === 'month-to-date' && (
        <Select
          value={selectedMonth.toString()}
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex-grow" />
      
      {timeRange !== 'last-12-months' && timeRange !== 'rolling-30-day' && !hideModeToggle && (
        <div className="flex">
          <Button
            variant={viewType === 'cumulative' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('cumulative')}
            className={`rounded-r-none ${
              viewType === 'cumulative' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Cumulative
          </Button>
          <Button
            variant={viewType === 'net-new' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('net-new')}
            className={`rounded-l-none border-l-0 ${
              viewType === 'net-new' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Net New
          </Button>
        </div>
      )}
      
      <Button
        variant="outline"
        onClick={onSortDirectionChange}
        className="h-10 ml-2"
        title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
      >
        <ArrowUpDown className="h-4 w-4 text-primary" />
        Sort
      </Button>
    </div>
  );
};
