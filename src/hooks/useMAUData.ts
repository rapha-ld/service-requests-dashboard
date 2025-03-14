import { useQuery } from "@tanstack/react-query";
import { getMockMAUData } from "@/utils/mauDataGenerator";
import { createFallbackData } from "@/utils/mauDataTransformers";
import { 
  TimeRangeType, 
  MAUDataResult,
  DateRange
} from "@/types/mauTypes";
import {
  formatRolling30DayData,
  formatLast12MonthsData,
  scaleDataToClientMAU,
  adjustRolling30DayData,
  calculateMAUTotals,
  limitDataToCurrentDate,
  capEnvironmentsData,
  formatCustomDateRangeData
} from "@/utils/mauDataFormatter";

// Client MAU value and limits from Overview page
const CLIENT_MAU_VALUE = 18450;
const USER_LIMIT = 25000;

export const useMAUData = (
  selectedMonth: number,
  selectedProject: string,
  timeRange: TimeRangeType,
  customDateRange?: DateRange
) => {
  const currentDate = customDateRange?.from || new Date(new Date().getFullYear(), selectedMonth);
  const safeProject = selectedProject || "all";

  const { data: mauData, isLoading, error } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), safeProject, timeRange, customDateRange?.to?.toISOString()],
    queryFn: async () => {
      try {
        const currentData = getMockMAUData(safeProject);
        const previousData = getMockMAUData(safeProject);
        
        if (!currentData || Object.keys(currentData).length === 0) {
          console.error("No current data returned for project", safeProject);
          return createFallbackData();
        }

        if (safeProject === "all") {
          const scaledData = scaleDataToClientMAU(currentData);
          
          if (timeRange === 'rolling-30-day') {
            adjustRolling30DayData(scaledData);
          }
        }

        let processedCurrentData = currentData;
        
        if (timeRange === 'last-12-months') {
          processedCurrentData = formatLast12MonthsData(currentData, safeProject);
        } else if (timeRange === 'rolling-30-day') {
          processedCurrentData = formatRolling30DayData(currentData, safeProject);
        } else if (timeRange === 'custom' && customDateRange?.from && customDateRange?.to) {
          processedCurrentData = formatCustomDateRangeData(currentData, customDateRange.from, customDateRange.to);
        } else if (timeRange === 'month-to-date') {
          processedCurrentData = limitDataToCurrentDate(processedCurrentData, 
            new Date(new Date().getFullYear(), selectedMonth, new Date().getDate()));
        }

        if (timeRange === 'custom' && customDateRange?.from && customDateRange?.to) {
          if (safeProject === "all") {
            processedCurrentData = capEnvironmentsData(processedCurrentData, USER_LIMIT);
          }
        }
        
        if (safeProject === "all") {
          processedCurrentData = capEnvironmentsData(processedCurrentData, USER_LIMIT);
        }

        const currentTotals = calculateMAUTotals(processedCurrentData);
        const previousTotals = calculateMAUTotals(previousData);

        return {
          current: processedCurrentData,
          previous: previousData,
          currentTotals,
          previousTotals
        };
      } catch (error) {
        console.error("Error fetching MAU data:", error);
        return createFallbackData();
      }
    },
    placeholderData: createFallbackData()
  });

  return {
    mauData: mauData || createFallbackData(),
    isLoading,
    error
  };
};

// Re-export types for convenience
export type { TimeRangeType, DateRange } from "@/types/mauTypes";
export type { MAUDataResult, ChartGroup } from "@/types/mauTypes";
