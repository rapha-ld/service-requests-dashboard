
import { TimeRangeType } from "@/types/mauTypes";

interface TimeRangeMessageProps {
  timeRange: TimeRangeType;
}

export const TimeRangeMessage = ({ timeRange }: TimeRangeMessageProps) => {
  if (timeRange !== 'rolling-30-day') return null;
  
  return (
    <div className="text-sm text-muted-foreground mb-4 mt-2">
      Trailing 30-Day Data - Resets on the 1st of Each Month
    </div>
  );
};
