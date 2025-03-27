
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/mau/DateRangePicker";
import { DateRange } from "@/types/mauTypes";
import { TimeRangeType } from "@/types/serviceData";
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
      <Button
        variant={timeRange === '3-day' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('3-day')}
        className={`rounded-l-md rounded-r-none h-8 ${
          timeRange === '3-day' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
        }`}
      >
        3D
      </Button>
      
      <Button
        variant={timeRange === 'rolling-30-day' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('rolling-30-day')}
        className={`rounded-none border-l-0 h-8 ${
          timeRange === 'rolling-30-day' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
        }`}
      >
        30D
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
              onClick={() => onTimeRangeChange('month-to-date')}
              className={`rounded-none border-l-0 h-8 ${
                timeRange === 'month-to-date' 
                  ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                  : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
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
        variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('last-12-months')}
        className={`rounded-none border-l-0 h-8 ${
          timeRange === 'last-12-months' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
        }`}
      >
        12M
      </Button>
      
      {/* Custom date range picker with rounded right corners */}
      <DateRangePicker 
        dateRange={customDateRange}
        onDateRangeChange={handleCustomDateRangeChange}
        isSelected={timeRange === 'custom'}
        onTimeRangeTypeChange={() => onTimeRangeChange('custom')}
      />
    </div>
  );
};
