
import { useQuery } from "@tanstack/react-query";
import { createFallbackData, getMockMAUData } from "@/utils/mauDataGenerator";
import { getTotalValue } from "@/utils/dataTransformers";
import { format, subMonths } from "date-fns";

export type TimeRangeType = 'month-to-date' | 'last-12-months';
export type EnvironmentData = Array<{ day: string; value: number }>;
export type EnvironmentsMap = Record<string, EnvironmentData>;

export type MAUDataResult = {
  current: EnvironmentsMap;
  previous: EnvironmentsMap;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
};

export interface ChartGroup {
  id: string;
  title: string;
  data: EnvironmentData;
  value: number;
  percentChange: number;
}

export const useMAUData = (
  selectedMonth: number,
  selectedProject: string,
  timeRange: TimeRangeType
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);

  // Fetch MAU data with proper error handling
  const { data: mauData = createFallbackData(), isLoading, error } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), selectedProject, timeRange],
    queryFn: async () => {
      try {
        // Get data for the selected project
        const currentData = getMockMAUData(selectedProject);
        const previousData = getMockMAUData(selectedProject);
        
        // Ensure we have valid data structures
        if (!currentData || Object.keys(currentData).length === 0) {
          console.error("No current data returned for project", selectedProject);
          return createFallbackData();
        }

        // Handle the case for last 12 months view
        if (timeRange === 'last-12-months') {
          const last12MonthsData: EnvironmentsMap = {};
          
          Object.keys(currentData).forEach(key => {
            last12MonthsData[key] = Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 5000)
            })).reverse();
          });

          // Calculate totals for each environment
          const currentTotals = Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          );
          
          const previousTotals = Object.fromEntries(
            Object.entries(previousData || {}).map(([key, data]) => [key, getTotalValue(data)])
          );

          return {
            current: last12MonthsData,
            previous: previousData || {},
            currentTotals,
            previousTotals
          };
        }

        // Calculate totals for regular month view
        const currentTotals = Object.fromEntries(
          Object.entries(currentData).map(([key, data]) => [key, getTotalValue(data)])
        );
        
        const previousTotals = Object.fromEntries(
          Object.entries(previousData || {}).map(([key, data]) => [key, getTotalValue(data)])
        );

        return {
          current: currentData,
          previous: previousData || {},
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
    mauData,
    isLoading,
    error
  };
};
