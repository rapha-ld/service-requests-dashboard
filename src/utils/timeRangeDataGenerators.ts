
import { format, subDays, eachDayOfInterval, parseISO, subMonths, eachMonthOfInterval, addHours, addDays, getHours, getMinutes } from "date-fns";
import { DateRange } from "@/types/mauTypes";

// Generate data for the last 12 months view
export const generateLast12MonthsData = (sourceData: Record<string, Array<{ day: string; value: number }>>) => {
  const today = new Date();
  const result: Record<string, Array<{ day: string; value: number }>> = {};
  
  // For each key in the source data
  Object.keys(sourceData).forEach(key => {
    // Get the last 12 months (including current month)
    const last12Months = eachMonthOfInterval({
      start: subMonths(today, 11),
      end: today
    });
    
    // Create month data points
    const monthData = last12Months.map((date, index) => {
      // Use existing values from source data, or generate random values
      const randomValue = Math.floor(Math.random() * 100) + 20;
      
      return {
        day: format(date, 'MMM yyyy'),
        value: randomValue
      };
    });
    
    result[key] = monthData;
  });
  
  return result;
};

// Generate data for the rolling 30-day view
export const generateRolling30DayData = (sourceData: Record<string, Array<{ day: string; value: number }>>) => {
  const today = new Date();
  const result: Record<string, Array<{ day: string; value: number }>> = {};
  
  // For each key in the source data
  Object.keys(sourceData).forEach(key => {
    // Get the last 30 days (including today)
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today
    });
    
    // Create day data points
    const dayData = last30Days.map((date, index) => {
      // Use existing values from source data, or generate random values
      const randomValue = Math.floor(Math.random() * 50) + 10;
      
      return {
        day: format(date, 'MMM d'),
        value: randomValue
      };
    });
    
    result[key] = dayData;
  });
  
  return result;
};

// Generate data for the 3-day view
export const generate3DayData = (sourceData: Record<string, Array<{ day: string; value: number }>>) => {
  const today = new Date();
  const result: Record<string, Array<{ day: string; value: number }>> = {};
  
  // For each key in the source data
  Object.keys(sourceData).forEach(key => {
    // Get the last 3 days (including today)
    const last3Days = eachDayOfInterval({
      start: subDays(today, 2),
      end: today
    });
    
    // Create day data points
    const dayData = last3Days.map((date, index) => {
      // Use existing values from source data, or generate random values
      const randomValue = Math.floor(Math.random() * 20) + 5;
      
      return {
        day: format(date, 'MMM d'),
        value: randomValue
      };
    });
    
    result[key] = dayData;
  });
  
  return result;
};

// Generate hourly data for 3-day view or custom short date range
export const generateHourlyData = (
  sourceData: Record<string, Array<{ day: string; value: number }>>,
  customDateRange?: DateRange
) => {
  const result: Record<string, Array<{ day: string; value: number }>> = {};
  let startDate: Date;
  let endDate: Date;
  
  // Determine the date range to use
  if (customDateRange && customDateRange.from && customDateRange.to) {
    // Use the custom date range
    startDate = customDateRange.from;
    endDate = customDateRange.to;
  } else {
    // Default to last 3 days
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End at the current day's end
    startDate = subDays(today, 2);
    startDate.setHours(0, 0, 0, 0); // Start at midnight 3 days ago
    endDate = today;
  }
  
  // For each key in the source data
  Object.keys(sourceData).forEach(key => {
    const hourlyData = [];
    let currentDate = new Date(startDate);
    
    // Generate hourly data points for the date range
    while (currentDate <= endDate) {
      // Skip generating too many data points for very large date ranges
      // Only generate hourly data for ranges up to 3 days
      if (hourlyData.length > 72) break; // Cap at 72 hours (3 days)
      
      // Generate a random value for this hour
      const randomValue = Math.floor(Math.random() * 5) + 1;
      
      // Format the datetime for display
      const formattedDateTime = format(currentDate, 'MMM d, HH:00');
      
      hourlyData.push({
        day: formattedDateTime,
        value: randomValue
      });
      
      // Move to next hour
      currentDate = addHours(currentDate, 1);
    }
    
    result[key] = hourlyData;
  });
  
  return result;
};

// Combine multiple datasets into a single dataset
export const combineDataSets = (
  dataSets: Array<Record<string, Array<{ day: string; value: number }>>>
) => {
  const result: Record<string, Array<{ day: string; value: number }>> = {};
  
  // For each dataset
  dataSets.forEach(dataSet => {
    // For each key in the dataset
    Object.keys(dataSet).forEach(key => {
      if (!result[key]) {
        result[key] = [...dataSet[key]];
      } else {
        // Combine the values for matching days
        dataSet[key].forEach((item, index) => {
          if (index < result[key].length) {
            result[key][index].value += item.value;
          } else {
            result[key].push(item);
          }
        });
      }
    });
  });
  
  return result;
};

// Process combined data for the API response format
export const processCombinedData = (
  combinedData: Record<string, Array<{ day: string; value: number }>>
) => {
  // Calculate totals for each environment
  const currentTotals = Object.fromEntries(
    Object.entries(combinedData).map(([key, data]) => [
      key,
      data.reduce((sum, item) => sum + item.value, 0)
    ])
  );
  
  // Create previous period data (just use 90% of current for mock data)
  const previousTotals = Object.fromEntries(
    Object.entries(currentTotals).map(([key, total]) => [
      key,
      Math.floor(total * 0.9)
    ])
  );
  
  return {
    current: combinedData,
    previous: combinedData, // Just reuse current data for previous
    currentTotals,
    previousTotals
  };
};
