
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

export const useServiceData = (
  selectedMonth: number,
  grouping: GroupingType,
  timeRange: TimeRangeType,
  customDateRange?: DateRange,
  hourlyData?: boolean
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  return useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange, customDateRange, hourlyData],
    queryFn: () => {
      if (grouping === 'all') {
        return handleAllDimensionsData(timeRange, customDateRange, hourlyData);
      }
      
      return handleSpecificDimensionData(grouping, timeRange, customDateRange, hourlyData);
    }
  });
};
