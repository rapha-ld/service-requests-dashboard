
import { EnvironmentsMap } from "@/types/mauTypes";
import { generateRolling30DayDateStrings, generateLast12MonthsDateStrings, getMonthNumber } from "./mauDateUtils";
import { format } from "date-fns";

// Client MAU value from the Overview page
const CLIENT_MAU_VALUE = 18450;

// Format data for rolling 30-day period
export const formatRolling30DayData = (currentData: EnvironmentsMap, safeProject: string) => {
  const rolling30DayData: EnvironmentsMap = {};
  const today = new Date();
  
  const dateStrings = generateRolling30DayDateStrings();
  
  Object.keys(currentData).forEach(key => {
    rolling30DayData[key] = dateStrings.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - index));
      const isFutureDate = date > today;
      
      // Determine if this is the first day of a month for resets
      const isFirstOfMonth = day.endsWith(" 1");
      
      return {
        day,
        value: isFutureDate ? null : 
              (isFirstOfMonth ? 0 : Math.floor((CLIENT_MAU_VALUE / 30) * (0.8 + Math.random() * 0.4)))
      };
    });
  });

  return rolling30DayData;
};

// Format data for last 12 months
export const formatLast12MonthsData = (currentData: EnvironmentsMap, safeProject: string) => {
  const last12MonthsData: EnvironmentsMap = {};
  
  const monthStrings = generateLast12MonthsDateStrings();
  
  Object.keys(currentData).forEach(key => {
    last12MonthsData[key] = monthStrings.map((month, index) => ({
      day: month,
      value: Math.floor(Math.random() * 5000)
    }));
  });

  if (safeProject === "all") {
    const totalMonthlyValue = CLIENT_MAU_VALUE / 12;
    Object.keys(last12MonthsData).forEach(env => {
      const envCount = Object.keys(last12MonthsData).length;
      const envValue = totalMonthlyValue / envCount;
      
      last12MonthsData[env] = last12MonthsData[env].map((day, idx) => ({
        day: day.day,
        value: Math.round(envValue * (0.7 + (idx / 11) * 0.6))
      }));
    });
  }

  return last12MonthsData;
};

// Format data for custom date range
export const formatCustomDateRangeData = (data: EnvironmentsMap, startDate: Date, endDate: Date): EnvironmentsMap => {
  const result: EnvironmentsMap = {};
  
  // Generate dates between start and end date
  const dateRange: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Format dates to match chart format
  const formattedDates = dateRange.map(date => format(date, 'MMM d'));
  
  // Create data for each environment
  Object.keys(data).forEach(env => {
    result[env] = formattedDates.map(day => ({
      day,
      value: Math.floor(Math.random() * 3000) + 1000 // Random value for demonstration
    }));
  });
  
  return result;
};

// Limit data to the current date
export const limitDataToCurrentDate = (data: EnvironmentsMap, endDate?: Date): EnvironmentsMap => {
  const result: EnvironmentsMap = {};
  // Use provided end date or default to current date
  const currentDate = endDate || new Date();
  
  Object.keys(data).forEach(env => {
    result[env] = data[env].map(dayData => {
      // Parse the date from the day string
      const dateParts = dayData.day.split(' ');
      if (dateParts.length !== 2) return dayData; // Not in the expected format
      
      const month = getMonthNumber(dateParts[0]);
      const day = parseInt(dateParts[1], 10);
      
      // Create a date object for comparison
      const dataDate = new Date(currentDate.getFullYear(), month, day);
      
      // If the date is after the current date, set value to null
      return {
        day: dayData.day,
        value: dataDate > currentDate ? null : dayData.value
      };
    });
  });
  
  return result;
};
