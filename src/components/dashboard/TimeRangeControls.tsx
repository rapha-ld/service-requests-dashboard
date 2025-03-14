
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/mau/DateRangePicker";
import { TimeRangeType, DateRange } from "@/types/mauTypes";

interface TimeRangeControlsProps {
  timeRange: TimeRangeType;
  onTimeRangeChange: (value: TimeRangeType) => void;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
}

export const TimeRangeControls = ({
  timeRange,
  onTimeRangeChange,
  customDateRange,
  onCustomDateRangeChange
}: TimeRangeControlsProps) => {
  // Handle custom date range selection
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    if (onCustomDateRangeChange) {
      onCustomDateRangeChange(dateRange);
      // Set time range to custom when date range is changed
      onTimeRangeChange('custom');
    }
  };

  return (
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
  );
};
