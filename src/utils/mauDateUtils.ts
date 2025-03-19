
import { format, subMonths, subDays } from "date-fns";

// Helper function to convert month abbreviation to month number
export const getMonthNumber = (monthAbbr: string): number => {
  const months: {[key: string]: number} = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return months[monthAbbr] || 0;
};

// Generate date strings for rolling 30-day period
export const generateRolling30DayDateStrings = () => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return format(date, 'MMM d');
  });
};

// Generate date strings for last 12 months
export const generateLast12MonthsDateStrings = () => {
  return Array.from({ length: 12 }, (_, i) => 
    format(subMonths(new Date(), i), 'MMM')
  ).reverse();
};
