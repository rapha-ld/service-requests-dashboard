
import { ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/mau/DateRangePicker";
import { DateRange } from "@/types/mauTypes";

interface ExperimentHeaderProps {
  viewType: 'net-new' | 'cumulative';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom') => void;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
}

export const ExperimentHeader = ({
  viewType,
  selectedMonth,
  sortDirection,
  timeRange,
  onViewTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange,
  customDateRange,
  onCustomDateRangeChange
}: ExperimentHeaderProps) => {
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

  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    if (onCustomDateRangeChange) {
      onCustomDateRangeChange(dateRange);
      // Set time range to custom when date range is changed
      onTimeRangeChange('custom');
    }
  };

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
      <div className="flex flex-wrap gap-0">
        {/* Date Range Picker - Should always be visible */}
        <DateRangePicker 
          dateRange={customDateRange}
          onDateRangeChange={handleCustomDateRangeChange}
          isSelected={timeRange === 'custom'}
          onTimeRangeTypeChange={() => onTimeRangeChange('custom')}
        />
        
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
      
      {/* Only show Cumulative/Net New toggle when not in Last 12 Months view */}
      {timeRange !== 'last-12-months' && (
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
