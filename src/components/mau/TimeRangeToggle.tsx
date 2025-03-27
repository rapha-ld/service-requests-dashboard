
import { Button } from "@/components/ui/button";
import { TimeRange } from "@/hooks/useExperimentData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon } from "lucide-react";

interface TimeRangeToggleProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export const TimeRangeToggle = ({
  timeRange,
  onTimeRangeChange
}: TimeRangeToggleProps) => {
  return (
    <>
      <Button
        variant={timeRange === '3-day' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('3-day')}
        className={`rounded-l-md rounded-r-none ${
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
        className={`rounded-none border-l-0 ${
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
              className={`rounded-none border-l-0 ${
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
        className={`rounded-none border-l-0 ${
          timeRange === 'last-12-months' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
        }`}
      >
        12M
      </Button>
      
      <Button
        variant={timeRange === 'custom' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('custom')}
        className={`rounded-r-md rounded-l-none border-l-0 ${
          timeRange === 'custom' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : 'bg-white dark:bg-black dark:border-[#6C6E7A]'
        }`}
      >
        <CalendarIcon className="h-4 w-4" />
      </Button>
    </>
  );
};
