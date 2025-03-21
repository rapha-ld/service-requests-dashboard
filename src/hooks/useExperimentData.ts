
import { useQuery } from "@tanstack/react-query";
import { generateExperimentData } from "@/utils/experiments";
import { DateRange } from "@/types/mauTypes";

export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day' | '3-day' | '7-day' | 'custom';

export const useExperimentData = (
  timeRange: TimeRangeType,
  currentDate: Date,
  customDateRange?: DateRange
) => {
  return useQuery({
    queryKey: ['experiment-data', timeRange, currentDate.toISOString(), customDateRange],
    queryFn: () => {
      return generateExperimentData(timeRange, currentDate, customDateRange);
    }
  });
};
