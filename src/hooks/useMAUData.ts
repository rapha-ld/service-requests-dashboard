
import { useQuery } from "@tanstack/react-query";
import { getMockMAUData } from "@/utils/mauDataGenerator";
import { createFallbackData } from "@/utils/mauDataTransformers";
import { 
  TimeRangeType, 
  MAUDataResult 
} from "@/types/mauTypes";
import {
  formatRolling30DayData,
  formatLast12MonthsData,
  scaleDataToClientMAU,
  adjustRolling30DayData,
  calculateMAUTotals,
  limitDataToCurrentDate,
  capEnvironmentsData
} from "@/utils/mauDataFormatter";

export const useMAUData = (
  selectedMonth: number,
  selectedProject: string,
  timeRange: TimeRangeType
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const safeProject = selectedProject || "all";

  const { data: mauData, isLoading, error } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), safeProject, timeRange],
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
        }

        // Apply date limitation for Month-to-Date view
        if (timeRange === 'month-to-date') {
          processedCurrentData = limitDataToCurrentDate(processedCurrentData);
        }
        
        // Cap the data at the threshold if it's the "all" project
        if (safeProject === "all") {
          processedCurrentData = capEnvironmentsData(processedCurrentData);
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
export type { TimeRangeType, MAUDataResult, ChartGroup } from "@/types/mauTypes";
