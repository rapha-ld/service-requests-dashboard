
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeRangeType } from "@/hooks/useMAUData";
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
  customDate?: Date;
  onCustomDateChange?: (date: Date) => void;
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
  customDate,
  onCustomDateChange
}: MAUDashboardControlsProps) => {
  // Local state for custom hour
  const [hour, setHour] = useState<string>(customDate ? format(customDate, 'HH') : '00');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(customDate);
  
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

  // Handle date selection with hour
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Create a new date with the selected hour
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour, 10), 0, 0, 0);
    
    if (onCustomDateChange) {
      onCustomDateChange(newDate);
    }
    
    // Set time range to custom
    onTimeRangeChange('custom');
  };
  
  // Handle hour change
  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = event.target.value;
    
    // Validate hour input (0-23)
    const hourNum = parseInt(newHour, 10);
    if (isNaN(hourNum) || hourNum < 0) {
      newHour = '00';
    } else if (hourNum > 23) {
      newHour = '23';
    } else if (newHour.length === 1) {
      newHour = `0${newHour}`;
    }
    
    setHour(newHour);
    
    // Update date with new hour if we have a selected date
    if (selectedDate && onCustomDateChange) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(newHour, 10), 0, 0, 0);
      onCustomDateChange(newDate);
    }
  };

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
      <ProjectSelector 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      
      <div className="flex">
        {/* Custom Date Picker with Hour */}
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
              {customDate 
                ? format(customDate, "MMM d, yyyy HH:mm") 
                : "Custom Date & Time"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="space-y-2">
                <Label htmlFor="hour">Hour (0-23):</Label>
                <Input
                  id="hour"
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={handleHourChange}
                  className="w-full"
                />
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
      
      {/* Only show Cumulative/Net New toggle when not in Last 12 Months view or Rolling 30-day view and hideModeToggle is false */}
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
