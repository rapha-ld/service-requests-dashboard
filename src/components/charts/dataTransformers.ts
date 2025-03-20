
import { format, parse, getDate } from 'date-fns';

export const getRequestStatus = (value: number) => {
  if (value <= 200) return 'good';
  if (value <= 400) return 'moderate';
  return 'poor';
};

export const getTotalValue = (data: Array<{ day: string; value: number | null }>) => {
  return data.reduce((sum, item) => sum + (item.value !== null ? item.value : 0), 0);
};

export const calculatePercentChange = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

// Transform raw data to cumulative values if needed
export const transformData = (
  data: Array<{ day: string; value: number | null }>, 
  viewType: 'net-new' | 'cumulative',
  handleResets = false,
  isDiagnosticPage = false
) => {
  if (viewType === 'net-new') return data;
  
  // For diagnostic pages, never handle resets even if handleResets is true
  const shouldHandleResets = handleResets && !isDiagnosticPage;
  
  // Track reset points for annotations
  const resetPoints: string[] = [];

  // Skip processing if there's no data
  if (!data.length) return [];

  // Get the first day from the data to check if we're starting mid-month
  const firstDay = data[0]?.day;
  
  // Check if the first day is NOT the first day of a month
  // This checks patterns like "Jan 1", "February 1", or just "1" for day number
  const isStartingMidMonth = firstDay && 
    !firstDay.includes(' 1') && 
    !firstDay.endsWith(' 1') && 
    firstDay !== '1';
  
  // Calculate accumulated value before our data window
  let accumulatedValueBeforeWindow = 0;
  
  // If we're starting in the middle of a month, we should include previous days' values
  if (isStartingMidMonth) {
    // Get the day number from the first day (e.g., extract "15" from "Jan 15")
    let dayNumber = 1;
    
    if (firstDay.includes(' ')) {
      // Format like "Jan 15"
      const parts = firstDay.split(' ');
      if (parts.length > 1) {
        dayNumber = parseInt(parts[1]);
      }
    } else if (/^\d+$/.test(firstDay)) {
      // Just a number like "15"
      dayNumber = parseInt(firstDay);
    } else {
      // Try to extract any number from the string
      const match = firstDay.match(/\d+/);
      if (match) {
        dayNumber = parseInt(match[0]);
      }
    }
    
    // Get average daily value from the first few data points that are not null
    const nonNullValues = data
      .filter(d => d.value !== null)
      .slice(0, Math.min(5, data.length));
      
    if (nonNullValues.length > 0) {
      const avgDailyValue = nonNullValues.reduce((sum, item) => sum + (item.value || 0), 0) / nonNullValues.length;
      // Estimate accumulated value based on day number (e.g., if it's the 15th, we'd have ~14 days of data already)
      accumulatedValueBeforeWindow = Math.round(avgDailyValue * (dayNumber - 1));
      
      // Ensure it's a positive value
      accumulatedValueBeforeWindow = Math.max(0, accumulatedValueBeforeWindow);
      
      console.log(`Starting mid-month on day ${dayNumber}, estimated accumulated value: ${accumulatedValueBeforeWindow}`);
    }
  }

  // Now transform the data to cumulative values
  const result = data.reduce((acc, curr, index) => {
    // For null values, just pass them through
    if (curr.value === null) {
      return [...acc, {
        day: curr.day,
        value: null
      }];
    }
    
    // Is this a month label (for Last 12 Months view) or a date with a month name?
    const isMonthlyView = curr.day.includes('Month') || 
                          /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test(curr.day);
    
    // Check if it's the first day of the month (date format like "Jan 1", "Feb 1", etc.)
    const isFirstOfMonth = curr.day.match(/ 1$/);
    
    if (index === 0) {
      // For the first data point, start with our pre-accumulated value plus the current value
      return [{
        day: curr.day,
        value: accumulatedValueBeforeWindow + (curr.value as number)
      }];
    } else {
      const previousItem = acc[index - 1];
      const previousValue = previousItem && previousItem.value !== null 
        ? previousItem.value 
        : accumulatedValueBeforeWindow;
      
      // Reset cumulative value if it's the first day of a month AND we should handle resets
      if (shouldHandleResets && isFirstOfMonth) {
        // Add to our reset points array for annotation
        resetPoints.push(curr.day);

        return [...acc, {
          day: curr.day,
          value: curr.value, // Start fresh on the 1st
          isResetPoint: true // Mark this as a reset point
        }];
      }
      
      // Otherwise continue accumulating
      return [...acc, {
        day: curr.day,
        value: previousValue + (curr.value as number)
      }];
    }
  }, [] as Array<{ day: string; value: number | null, isResetPoint?: boolean }>);

  // Logging to help with debugging
  if (isStartingMidMonth) {
    console.log('Cumulative data with mid-month start:', {
      firstDay,
      accumulatedValueBeforeWindow,
      firstDataPoint: result[0],
      lastDataPoint: result[result.length - 1]
    });
  }

  return result;
};

// Calculate average from non-null values
export const calculateAverage = (data: Array<{ day: string; value: number | null }>) => {
  const nonNullValues = data.filter(item => item.value !== null).map(item => item.value as number);
  return nonNullValues.length > 0 
    ? nonNullValues.reduce((sum, value) => sum + value, 0) / nonNullValues.length 
    : 0;
};

// Format date for tooltip display
export const formatTooltipDate = (day: string) => {
  if (day.includes(' ')) return day;
  
  if (!isNaN(parseInt(day))) {
    const date = new Date(new Date().getFullYear(), 0, parseInt(day));
    return format(date, 'MMM dd, yyyy');
  }
  
  return day;
};
