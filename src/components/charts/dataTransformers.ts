
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
  handleResets = false
) => {
  if (viewType === 'net-new') return data;
  
  return data.reduce((acc, curr, index) => {
    // Always include the day, but set future dates or null values to null
    if (curr.value === null) {
      return [...acc, {
        day: curr.day,
        value: null
      }];
    }
    
    // For Last 12 Months view, treat each month as its own cumulative sequence
    // if the day includes a "Month" label, it's from the Last 12 Months view
    const isLast12MonthsView = curr.day.includes('Month') || curr.day.includes('Jan') || curr.day.includes('Feb') || 
                              curr.day.includes('Mar') || curr.day.includes('Apr') || curr.day.includes('May') || 
                              curr.day.includes('Jun') || curr.day.includes('Jul') || curr.day.includes('Aug') || 
                              curr.day.includes('Sep') || curr.day.includes('Oct') || curr.day.includes('Nov') || 
                              curr.day.includes('Dec');
    
    // Check if it's the first day of the month (when a date looks like "Jan 1", "Feb 1", etc.)
    const isFirstOfMonth = curr.day.match(/ 1$/);
    
    if (index > 0) {
      const previousItem = acc[index - 1];
      const previousValue = previousItem && previousItem.value !== null ? previousItem.value : 0;
      
      // Reset cumulative value if it's the first day of a month in trailing 30-day view
      // and handleResets is true (specifically for plan usage charts)
      if (handleResets && isFirstOfMonth) {
        return [...acc, {
          day: curr.day,
          value: curr.value // Start fresh on the 1st
        }];
      }
      
      // Otherwise continue accumulating
      return [...acc, {
        day: curr.day,
        value: previousValue + (curr.value as number)
      }];
    }
    
    // First item keeps its original value
    return [...acc, {
      day: curr.day,
      value: curr.value
    }];
  }, [] as Array<{ day: string; value: number | null }>);
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
