
import { format, subMonths, subDays, isAfter, parse, getDate, getMonth, subHours } from "date-fns";
import { getTotalValue } from "@/components/charts/dataTransformers";
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";

// Generate data for last 12 months view
export const generateLast12MonthsData = (currentData: Record<string, any[]>) => {
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 12 }, (_, i) => ({
        day: format(subMonths(new Date(), i), 'MMM'),
        value: Math.floor(Math.random() * 1000)
      })).reverse()
    ])
  );
};

// Generate data for 3-day view with hourly data
export const generate3DayData = (currentData: Record<string, any[]>) => {
  const today = new Date();
  const hoursPerDay = 24;
  const totalHours = 3 * hoursPerDay;
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: totalHours }, (_, i) => {
        const date = subHours(today, totalHours - 1 - i);
        const isFutureDate = isAfter(date, today);
        
        // Generate daily values that make sense in both cumulative and net-new views
        // For cumulative view, these will be properly accumulated in the client
        const dayOfMonth = getDate(date);
        const dayMultiplier = Math.min(dayOfMonth, 15) / 15;  // Scale factor based on day of month
        
        return {
          day: format(date, 'MMM d, HH:00'),
          value: isFutureDate ? null : Math.floor(Math.random() * 20 + 5 * dayMultiplier)
        };
      })
    ])
  );
};

// Generate data for 7-day view
export const generate7DayData = (currentData: Record<string, any[]>) => {
  const today = new Date();
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        const isFutureDate = isAfter(date, today);
        
        // Generate daily values that make sense in both cumulative and net-new views
        // For cumulative view, these will be properly accumulated in the client
        const dayOfMonth = getDate(date);
        const dayMultiplier = Math.min(dayOfMonth, 20) / 20;  // Scale factor based on day of month
        
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * 80 + 20 * dayMultiplier) // Values between 20-100
        };
      })
    ])
  );
};

// Generate data for rolling 30 days view with reset on the 1st of each month
export const generateRolling30DayData = (currentData: Record<string, any[]>) => {
  const today = new Date();
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 29 - i);
        const isFutureDate = isAfter(date, today);
        const dayOfMonth = getDate(date);
        
        // Generate daily values that will be properly accumulated in the transformData function
        // Low values on the 1st of each month to simulate resets
        const baseValue = dayOfMonth === 1 ? 50 : 100;
        
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * baseValue)
        };
      })
    ])
  );
};

// Generate data for custom date range
export const generateCustomDateRangeData = (currentData: Record<string, any[]>, dateRange: DateRange) => {
  // In a real implementation, this would fetch data for the specific date range
  // For now, just return the current data
  return currentData;
};

// Combine data from multiple data sets into a single dataset
export const combineDataSets = (dataSets: Record<string, Array<{ day: string; value: number }>>[]) => {
  const firstDataSet = dataSets[0];
  const firstKey = Object.keys(firstDataSet)[0];
  const template = firstDataSet[firstKey].map(item => ({ day: item.day, value: 0 }));
  
  dataSets.forEach(dataSet => {
    Object.values(dataSet).forEach(dimensionData => {
      dimensionData.forEach((dayData, index) => {
        template[index].value += dayData.value;
      });
    });
  });
  
  return { total: template };
};

// Process the combined data to include totals
export const processCombinedData = (combined: { total: Array<{ day: string; value: number }> }) => {
  return {
    current: combined,
    previous: combined,
    currentTotals: {
      total: getTotalValue(combined.total)
    },
    previousTotals: {
      total: getTotalValue(combined.total)
    }
  };
};
