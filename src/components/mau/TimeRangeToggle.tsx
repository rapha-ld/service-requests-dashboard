
import { Button } from "@/components/ui/button";
import { TimeRangeType } from "@/types/mauTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeRangeToggleProps {
  timeRange: TimeRangeType;
  onTimeRangeChange: (value: TimeRangeType) => void;
}

export const TimeRangeToggle = ({
  timeRange,
  onTimeRangeChange
}: TimeRangeToggleProps) => {
  return (
    <>
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
        className={`rounded-none border-l-0 ${
          timeRange === 'last-12-months' 
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Last 12M
      </Button>
      
      <Button
        variant={timeRange === 'custom' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('custom')}
        className={`rounded-l-none border-l-0 ${
          timeRange === 'custom' 
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Custom
      </Button>
    </>
  );
};
