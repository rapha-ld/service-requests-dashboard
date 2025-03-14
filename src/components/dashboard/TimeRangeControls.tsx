
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/mau/DateRangePicker";
import { TimeRangeType, DateRange } from "@/types/mauTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
              onClick={() => onTimeRangeChange('month-to-date')}
              className={`rounded-l-md rounded-r-none ${
                timeRange === 'month-to-date' 
                  ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                  : ''
              }`}
            >
              MTD
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Month-to-Date</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button
        variant={timeRange === 'rolling-30-day' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('rolling-30-day')}
        className={`rounded-none border-l-0 ${
          timeRange === 'rolling-30-day' 
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Trailing 30D
      </Button>
      
      <Button
        variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('last-12-months')}
        className={`rounded-none rounded-r-md border-l-0 ${
          timeRange === 'last-12-months' 
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Last 12M
      </Button>
      
      {/* Custom date range picker moved to the end with rounded corners */}
      <DateRangePicker 
        dateRange={customDateRange}
        onDateRangeChange={handleCustomDateRangeChange}
        isSelected={timeRange === 'custom'}
        onTimeRangeTypeChange={() => onTimeRangeChange('custom')}
      />
    </div>
  );
};
