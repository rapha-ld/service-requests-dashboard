
import { format, parse, getDate, startOfMonth, differenceInDays } from 'date-fns';

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

  // If there's no data, return empty array
  if (!data || data.length === 0) return [];

  // Get the first day from the data
  const firstDay = data[0]?.day;
  if (!firstDay) return data;

  // Detect if we're in a rolling view (dates like "Feb 19", "Mar 1", etc.)
  const isRollingDayFormat = firstDay.includes(' ');
  
  // For rolling day view (3D, 7D, 30D), check if we're starting mid-month
  let accumulatedValueBeforeWindow = 0;
  let startDayOfMonth = 1;
  
  if (isRollingDayFormat) {
    // Parse the day number from the first data point
    const match = firstDay.match(/\w+ (\d+)/);
    if (match && match[1]) {
      startDayOfMonth = parseInt(match[1]);
      const isStartingMidMonth = startDayOfMonth > 1;
      
      if (isStartingMidMonth) {
        // Calculate a reasonable starting value based on days already passed in the month
        // Find the first few non-null values to get an average daily value
        const nonNullValues = data.filter(d => d.value !== null).slice(0, 5);
        if (nonNullValues.length > 0) {
          const avgDailyValue = nonNullValues.reduce((sum, item) => sum + (item.value || 0), 0) / nonNullValues.length;
          
          // Estimate accumulated value based on days already passed
          accumulatedValueBeforeWindow = Math.round(avgDailyValue * (startDayOfMonth - 1));
          
          console.log(`Starting mid-month on day ${startDayOfMonth}. Estimated accumulated value: ${accumulatedValueBeforeWindow}`);
        }
      }
    }
  }

  const result = data.reduce((acc, curr, index) => {
    // Handle null values
    if (curr.value === null) {
      return [...acc, {
        day: curr.day,
        value: null
      }];
    }
    
    // For day views (3D, 7D, 30D), check if it's the first of a month (e.g., "Mar 1")
    const isFirstOfMonth = isRollingDayFormat && curr.day.match(/ 1$/);
    
    if (index === 0) {
      // For the first data point, include the pre-accumulated value
      return [{
        day: curr.day,
        value: accumulatedValueBeforeWindow + (curr.value as number)
      }];
    } else {
      const previousItem = acc[index - 1];
      const previousValue = previousItem && previousItem.value !== null 
        ? previousItem.value 
        : accumulatedValueBeforeWindow;
      
      // Reset cumulative value if it's the first day of a month and we should handle resets
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
