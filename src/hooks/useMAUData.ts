import { useQuery } from "@tanstack/react-query";
import { getMockMAUData } from "@/utils/mauDataGenerator";
import { getTotalValue } from "@/utils/dataTransformers";
import { format, subMonths, subDays } from "date-fns";
import { createFallbackData } from "@/utils/mauDataTransformers";

export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day';
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

// Client MAU value from the Overview page
const CLIENT_MAU_VALUE = 18450;

export const useMAUData = (
  selectedMonth: number,
  selectedProject: string,
  timeRange: TimeRangeType
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const safeProject = selectedProject || "all"; // Default to "all" if project is undefined

  // Fetch MAU data with proper error handling
  const { data: mauData, isLoading, error } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), safeProject, timeRange],
    queryFn: async () => {
      try {
        // Get data for the selected project
        const currentData = getMockMAUData(safeProject);
        const previousData = getMockMAUData(safeProject);
        
        // Ensure we have valid data structures
        if (!currentData || Object.keys(currentData).length === 0) {
          console.error("No current data returned for project", safeProject);
          return createFallbackData();
        }

        // If we're showing "all" projects, ensure the total matches the Overview page
        if (safeProject === "all") {
          let totalCurrentMAU = 0;
          
          // Calculate the current total across all environments
          Object.values(currentData).forEach(envData => {
            totalCurrentMAU += getTotalValue(envData);
          });
          
          // Scaling factor to adjust all values proportionally
          const scalingFactor = CLIENT_MAU_VALUE / totalCurrentMAU;
          
          // Scale all values to match the overview page total
          Object.keys(currentData).forEach(env => {
            currentData[env] = currentData[env].map(day => ({
              ...day,
              value: Math.round(day.value * scalingFactor)
            }));
          });
        }

        // Handle different time range views
        if (timeRange === 'last-12-months') {
          const last12MonthsData: EnvironmentsMap = {};
          
          Object.keys(currentData).forEach(key => {
            last12MonthsData[key] = Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 5000)
            })).reverse();
          });

          // If we're showing "all" projects, ensure the total 12-month data matches the Overview
          if (safeProject === "all") {
            // Adjust the last-12-months data to match CLIENT_MAU_VALUE over the period
            const totalMonthlyValue = CLIENT_MAU_VALUE / 12;
            Object.keys(last12MonthsData).forEach(env => {
              const envCount = Object.keys(last12MonthsData).length;
              const envValue = totalMonthlyValue / envCount;
              
              last12MonthsData[env] = last12MonthsData[env].map((day, idx) => ({
                day: day.day,
                // Add some variation while keeping the overall total close to CLIENT_MAU_VALUE
                value: Math.round(envValue * (0.7 + (idx / 11) * 0.6))
              }));
            });
          }

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
        
        // Handle rolling 30 day view
        if (timeRange === 'rolling-30-day') {
          const rolling30DayData: EnvironmentsMap = {};
          
          // Generate consistent date strings for all environments to ensure they match
          const dateStrings = Array.from({ length: 30 }, (_, i) => 
            format(subDays(new Date(), 29 - i), 'MMM d')
          );
          
          Object.keys(currentData).forEach(key => {
            rolling30DayData[key] = dateStrings.map(day => ({
              day,
              value: Math.floor(Math.random() * 1000)
            }));
          });

          // If we're showing "all" projects, ensure the total 30-day data is proportional
          if (safeProject === "all") {
            const totalDailyValue = CLIENT_MAU_VALUE / 30;
            
            // Create the "all projects" total data with exactly the same dates
            rolling30DayData["total"] = dateStrings.map((day, idx) => ({
              day,
              value: 0 // Will be calculated below
            }));
            
            // Calculate values for individual environments and sum for total
            Object.keys(rolling30DayData).forEach(env => {
              if (env === "total") return; // Skip the total for now
              
              const envCount = Object.keys(rolling30DayData).length - 1; // -1 to exclude "total"
              const envValue = totalDailyValue / envCount;
              
              rolling30DayData[env] = dateStrings.map((day, idx) => {
                // Add some variation while keeping a reasonable pattern
                const value = Math.round(envValue * (0.8 + (idx / 30) * 0.4));
                
                // Add to the total for this day
                if (rolling30DayData["total"] && rolling30DayData["total"][idx]) {
                  rolling30DayData["total"][idx].value += value;
                }
                
                return { day, value };
              });
            });
            
            // Remove the artificial "total" entry if it was created just for calculation
            if (!currentData["total"]) {
              delete rolling30DayData["total"];
            }
          }

          // Calculate totals for each environment
          const currentTotals = Object.fromEntries(
            Object.entries(rolling30DayData).map(([key, data]) => [key, getTotalValue(data)])
          );
          
          const previousTotals = Object.fromEntries(
            Object.entries(previousData || {}).map(([key, data]) => [key, getTotalValue(data)])
          );

          return {
            current: rolling30DayData,
            previous: previousData || {},
            currentTotals,
            previousTotals
          };
        }

        // Regular month-to-date view (default)
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
    mauData: mauData || createFallbackData(), // Always return valid data structure
    isLoading,
    error
  };
};
