
import { useQuery } from "@tanstack/react-query";
import { generateExperimentData } from "@/utils/experiments";
import { DateRange } from "@/types/mauTypes";
import type { TimeRangeType } from "@/types/serviceData";

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

// Import type explicitly to avoid re-export issues
import type { TimeRangeType as TimeRange } from "@/types/serviceData";
// Re-export types for convenience
export type { TimeRange };
