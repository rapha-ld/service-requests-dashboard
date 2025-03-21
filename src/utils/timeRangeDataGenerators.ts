
import { format, subMonths, subDays, isAfter, parse, getDate, getMonth, subHours } from "date-fns";
import { getTotalValue } from "@/components/charts/dataTransformers";
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";

// Generate data for last 12 months view
export const generateLast12MonthsData = (currentData: Record<string, any[]>, selectedYear: number = new Date().getFullYear()) => {
  const today = new Date();
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(today, i);
        return {
          day: format(date, 'MMM'),
          value: Math.floor(Math.random() * 1000)
        };
      }).reverse()
    ])
  );
};

// Generate data for 3-day view with hourly data
export const generate3DayData = (currentData: Record<string, any[]>, selectedDate: Date = new Date()) => {
  const hoursPerDay = 24;
  const totalHours = 3 * hoursPerDay;
  
  // If selected date is in the future, use current date
  const baseDate = isAfter(selectedDate, new Date()) ? new Date() : selectedDate;
  console.log(`Generating 3-day data for base date: ${format(baseDate, 'yyyy-MM-dd')}`);
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: totalHours }, (_, i) => {
        const date = subHours(baseDate, totalHours - 1 - i);
        const isFutureDate = isAfter(date, new Date());
        
        // Generate daily values that simulate realistic accumulation when viewed cumulatively
        // Higher values on later days in the month to show natural growth
        const dayOfMonth = getDate(date);
        const monthProgress = Math.min(dayOfMonth / 28, 1); // Scale based on position in month
        
        // Base value grows throughout the month
        const baseValue = Math.floor(5 + (15 * monthProgress));
        
        // Add some randomness
        const randomFactor = 0.7 + (Math.random() * 0.6);
        
        return {
          day: format(date, 'MMM d, HH:00'),
          value: isFutureDate ? null : Math.floor(baseValue * randomFactor)
        };
      })
    ])
  );
};

// Generate data for 7-day view
export const generate7DayData = (currentData: Record<string, any[]>, selectedDate: Date = new Date()) => {
  // If selected date is in the future, use current date
  const baseDate = isAfter(selectedDate, new Date()) ? new Date() : selectedDate;
  console.log(`Generating 7-day data for base date: ${format(baseDate, 'yyyy-MM-dd')}`);
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 7 }, (_, i) => {
        const date = subDays(baseDate, 6 - i);
        const isFutureDate = isAfter(date, new Date());
        
        // Generate values that simulate realistic accumulation when viewed cumulatively
        // Higher values on later days in the month
        const dayOfMonth = getDate(date);
        const monthProgress = Math.min(dayOfMonth / 28, 1); // Scale based on position in month
        
        // Base value grows throughout the month
        const baseValue = Math.floor(20 + (60 * monthProgress));
        
        // Add some randomness
        const randomFactor = 0.8 + (Math.random() * 0.4);
        
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(baseValue * randomFactor)
        };
      })
    ])
  );
};

// Generate data for rolling 30 days view with reset on the 1st of each month
export const generateRolling30DayData = (currentData: Record<string, any[]>, selectedDate: Date = new Date()) => {
  // If selected date is in the future, use current date
  const baseDate = isAfter(selectedDate, new Date()) ? new Date() : selectedDate;
  console.log(`Generating 30-day data for base date: ${format(baseDate, 'yyyy-MM-dd')}`);
  
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 30 }, (_, i) => {
        const date = subDays(baseDate, 29 - i);
        const isFutureDate = isAfter(date, new Date());
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
export const combineDataSets = (dataSets: Record<string, Array<{ day: string; value: number | null }>>[]) => {
  const firstDataSet = dataSets[0];
  const firstKey = Object.keys(firstDataSet)[0];
  const template = firstDataSet[firstKey].map(item => ({ day: item.day, value: 0 }));
  
  dataSets.forEach(dataSet => {
    Object.values(dataSet).forEach(dimensionData => {
      dimensionData.forEach((dayData, index) => {
        if (template[index] && dayData.value !== null) {
          template[index].value += dayData.value;
        }
      });
    });
  });
  
  return { total: template };
};

// Process the combined data to include totals
export const processCombinedData = (combined: { total: Array<{ day: string; value: number | null }> }) => {
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
