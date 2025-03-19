
import { TimeRangeType } from "@/types/mauTypes";

interface TimeRangeMessageProps {
  timeRange: TimeRangeType;
  viewType: 'net-new' | 'cumulative';
}

export const TimeRangeMessage = ({ timeRange, viewType }: TimeRangeMessageProps) => {
  // Only show the message for 30-day timeframe AND cumulative view
  if (timeRange !== 'rolling-30-day' || viewType !== 'cumulative') return null;
  
  return (
    <div className="text-sm text-muted-foreground">
      Cumulative usage - resets monthly
    </div>
  );
};
