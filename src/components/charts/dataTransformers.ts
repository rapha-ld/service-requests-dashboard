
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
  viewType: 'net-new' | 'cumulative' | 'rolling-30d',
  handleResets = false,
  isDiagnosticPage = false
) => {
  if (viewType === 'net-new') return data;
  
  // For rolling-30d, we process data to show rolling 30-day totals
  if (viewType === 'rolling-30d') {
    return calculateRolling30DayValues(data);
  }
  
  // For diagnostic pages, never handle resets even if handleResets is true
  const shouldHandleResets = handleResets && !isDiagnosticPage;
  
  // Track reset points for annotations
  const resetPoints: string[] = [];

  // If there's no data, return empty array
  if (!data || data.length === 0) return [];

  // Get the first day from the data
  const firstDay = data[0]?.day;
  if (!firstDay) return data;

  // Detect if we're in a rolling format with dates like "Feb 19", "Mar 1", etc.
  const isRollingFormat = firstDay.includes(' ');
  
  // Always calculate a reasonable accumulated value before the beginning of our data window
  let accumulatedValueBeforeWindow = 0;
  let startDayOfMonth = 1;
  
  if (isRollingFormat) {
    // For all rolling formats (3D, 7D, 30D), estimate values from beginning of month
    
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
    
    // For rolling views, check if it's the first of a month (e.g., "Mar 1")
    const isFirstOfMonth = isRollingFormat && curr.day.match(/ 1$/);
    
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

// Calculate rolling 30-day values for each data point
const calculateRolling30DayValues = (
  data: Array<{ day: string; value: number | null }>
) => {
  // If there's not enough data, return as-is
  if (!data || data.length === 0) return data;
  
  // Create a new array to store the rolling values
  return data.map((currentPoint, currentIndex) => {
    // Skip null values
    if (currentPoint.value === null) {
      return { ...currentPoint };
    }
    
    // For each point, sum the value of this point and up to 29 previous points (or fewer if not available)
    let rollingSum = 0;
    let count = 0;
    
    // Look back up to 30 days (including current day)
    for (let i = 0; i < 30 && currentIndex - i >= 0; i++) {
      const point = data[currentIndex - i];
      if (point && point.value !== null) {
        rollingSum += point.value;
        count++;
      }
    }
    
    return {
      day: currentPoint.day,
      value: rollingSum
    };
  });
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
