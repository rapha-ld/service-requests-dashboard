
import { format } from 'date-fns';

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
  viewType: 'net-new' | 'cumulative'
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
    
    // For rolling 30-day view, check if we're crossing a month boundary
    if (index > 0) {
      const prevDate = new Date(formatTooltipDate(acc[index - 1].day));
      const currDate = new Date(formatTooltipDate(curr.day));
      
      // If the current day is in a different month than the previous day,
      // start cumulative sum from current value
      if (prevDate.getMonth() !== currDate.getMonth()) {
        return [...acc, {
          day: curr.day,
          value: curr.value
        }];
      }
    }
    
    const previousItem = index > 0 ? acc[index - 1] : null;
    const previousValue = previousItem && previousItem.value !== null ? previousItem.value : 0;
    
    return [...acc, {
      day: curr.day,
      value: previousValue + (curr.value as number)
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
