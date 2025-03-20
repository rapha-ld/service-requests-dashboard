
import { format, subMonths, subDays, isAfter, parse, getDate, getMonth } from "date-fns";
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

// Generate data for 3-day view with values that can be accumulated from the beginning of the month
export const generate3DayData = (currentData: Record<string, any[]>) => {
  const today = new Date();
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 3 }, (_, i) => {
        const date = subDays(today, 2 - i);
        const isFutureDate = isAfter(date, today);
        const dayOfMonth = getDate(date);
        
        // For consistency with 30-day view, ensure we generate data that represents daily values
        // rather than pre-accumulated values (accumulation happens in the transform function)
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * 200)
        };
      })
    ])
  );
};

// Generate data for 7-day view with values that can be accumulated from the beginning of the month
export const generate7DayData = (currentData: Record<string, any[]>) => {
  const today = new Date();
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        const isFutureDate = isAfter(date, today);
        const dayOfMonth = getDate(date);
        
        // For consistency with 30-day view, ensure we generate data that represents daily values
        // rather than pre-accumulated values (accumulation happens in the transform function)
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * 300)
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
        
        // Set value to 0 on the 1st of each month and generate random values for other days
        // This ensures values reset on the 1st of each month
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : (dayOfMonth === 1 ? 0 : Math.floor(Math.random() * 500))
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
