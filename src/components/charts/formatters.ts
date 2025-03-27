
import { format, parse } from 'date-fns';

// Format date for tooltip display
export const formatTooltipDate = (day: string) => {
  if (day.includes(' ')) return day;
  
  if (!isNaN(parseInt(day))) {
    const date = new Date(new Date().getFullYear(), 0, parseInt(day));
    return format(date, 'MMM d, yyyy');
  }
  
  // Try to parse the date if it's in ISO format
  if (day.includes('-')) {
    try {
      const date = new Date(day);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      // If parsing fails, return original
      return day;
    }
  }
  
  return day;
};

// Format Y-axis tick values to prevent truncation
export const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};
