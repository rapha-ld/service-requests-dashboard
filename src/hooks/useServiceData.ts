
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

export const useServiceData = (
  selectedMonth: number,
  selectedYear: number = new Date().getFullYear(), // Add year parameter with default
  grouping: GroupingType,
  timeRange: TimeRangeType,
  customDateRange?: DateRange
) => {
  const currentDate = new Date(selectedYear, selectedMonth);
  const previousDate = new Date(
    selectedMonth === 0 ? selectedYear - 1 : selectedYear, 
    selectedMonth === 0 ? 11 : selectedMonth - 1
  );

  return useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange, customDateRange],
    queryFn: () => {
      if (grouping === 'all') {
        return handleAllDimensionsData(timeRange, currentDate, customDateRange);
      }
      
      return handleSpecificDimensionData(grouping, timeRange, currentDate, customDateRange);
    }
  });
};
