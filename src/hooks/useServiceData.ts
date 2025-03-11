
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

export const useServiceData = (
  selectedMonth: number,
  grouping: GroupingType,
  timeRange: TimeRangeType
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  return useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange],
    queryFn: () => {
      if (grouping === 'all') {
        return handleAllDimensionsData(timeRange);
      }
      
      return handleSpecificDimensionData(grouping, timeRange);
    }
  });
};
