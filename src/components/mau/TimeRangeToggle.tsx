
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
              className={`rounded-l-md rounded-r-none ${
                timeRange === 'month-to-date' 
                  ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
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
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
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
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        Last 12M
      </Button>
      
      <Button
        variant={timeRange === 'custom' ? 'default' : 'outline'}
        onClick={() => onTimeRangeChange('custom')}
        className={`rounded-r-md rounded-l-none border-l-0 ${
          timeRange === 'custom' 
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        Custom
      </Button>
    </>
  );
};
