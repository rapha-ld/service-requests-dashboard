
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

export const useServiceData = (
  selectedMonth: number,
  selectedYear: number = new Date().getFullYear(),
  grouping: GroupingType,
  timeRange: TimeRangeType,
  customDateRange?: DateRange
) => {
  const currentDate = new Date(selectedYear, selectedMonth);
  const previousDate = new Date(selectedYear, selectedMonth - 1);

  return useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange, customDateRange],
    queryFn: () => {
      if (grouping === 'all') {
        return handleAllDimensionsData(timeRange, selectedMonth, selectedYear, customDateRange);
      }
      
      return handleSpecificDimensionData(grouping, timeRange, selectedMonth, selectedYear, customDateRange);
    }
  });
};
