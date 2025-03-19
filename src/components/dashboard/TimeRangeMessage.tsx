
import { TimeRangeType } from "@/types/mauTypes";
import { useLocation } from "react-router-dom";

interface TimeRangeMessageProps {
  timeRange: TimeRangeType;
  viewType: 'net-new' | 'cumulative';
}

export const TimeRangeMessage = ({ timeRange, viewType }: TimeRangeMessageProps) => {
  const location = useLocation();
  
  // Define which routes are considered Plan Usage pages vs Diagnostic pages
  const isPlanUsagePage = [
    "/overview",
    "/client-mau",
    "/experiments",
    "/data-export",
    "/service-connections", // Service-connections is a plan usage page
    "/service-requests"     // Adding service-requests as a plan usage page
  ].includes(location.pathname);
  
  // Only show the message for:
  // 1. 30-day timeframe AND
  // 2. cumulative view AND
  // 3. We're on a Plan Usage page
  if (timeRange !== 'rolling-30-day' || viewType !== 'cumulative' || !isPlanUsagePage) return null;
  
  return (
    <div className="text-sm text-muted-foreground">
      Trailing 30 day usage - resets monthly
    </div>
  );
};
