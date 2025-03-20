
import { TimeRangeType } from "@/types/mauTypes";
import { useLocation } from "react-router-dom";

interface TimeRangeMessageProps {
  timeRange: TimeRangeType;
  viewType: 'net-new' | 'cumulative';
}

export const TimeRangeMessage = ({ timeRange, viewType }: TimeRangeMessageProps) => {
  // This component no longer displays any message
  return null;
};
