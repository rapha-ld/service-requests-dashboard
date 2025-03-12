import { format, subMonths, subDays } from "date-fns";
import { EnvironmentsMap, MAUDataResult } from "@/types/mauTypes";
import { getMockMAUData } from "./mauDataGenerator";
import { getTotalValue } from "./dataTransformers";

// Client MAU value from the Overview page
const CLIENT_MAU_VALUE = 18450;
// User limit threshold
const USER_LIMIT = 25000;

export const formatRolling30DayData = (currentData: EnvironmentsMap, safeProject: string) => {
  const rolling30DayData: EnvironmentsMap = {};
  const today = new Date();
  
  const dateStrings = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return format(date, 'MMM d');
  });
  
  Object.keys(currentData).forEach(key => {
    rolling30DayData[key] = dateStrings.map((day, index) => {
      const date = subDays(today, 29 - index);
      const isFutureDate = date > today;
      
      return {
        day,
        value: isFutureDate ? null : Math.floor((CLIENT_MAU_VALUE / 30) * (0.8 + Math.random() * 0.4))
      };
    });
  });

  return rolling30DayData;
};

export const formatLast12MonthsData = (currentData: EnvironmentsMap, safeProject: string) => {
  const last12MonthsData: EnvironmentsMap = {};
  
  Object.keys(currentData).forEach(key => {
    last12MonthsData[key] = Array.from({ length: 12 }, (_, i) => ({
      day: format(subMonths(new Date(), i), 'MMM'),
      value: Math.floor(Math.random() * 5000)
    })).reverse();
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

export const scaleDataToClientMAU = (currentData: EnvironmentsMap) => {
  let totalCurrentMAU = 0;
  
  Object.values(currentData).forEach(envData => {
    totalCurrentMAU += getTotalValue(envData);
  });
  
  const scalingFactor = CLIENT_MAU_VALUE / totalCurrentMAU;
  
  Object.keys(currentData).forEach(env => {
    currentData[env] = currentData[env].map(day => ({
      ...day,
      value: Math.round(day.value * scalingFactor)
    }));
  });

  return currentData;
};

export const adjustRolling30DayData = (currentData: EnvironmentsMap) => {
  const daysInPeriod = 30;
  const targetDailyAverage = CLIENT_MAU_VALUE / daysInPeriod;

  Object.keys(currentData).forEach(env => {
    const envCount = Object.keys(currentData).length;
    const envDailyTarget = targetDailyAverage / envCount;
    
    currentData[env] = currentData[env].map((day, idx) => ({
      day: day.day,
      value: Math.round(envDailyTarget * (0.8 + (idx / daysInPeriod) * 0.4))
    }));
  });

  return currentData;
};

export const calculateMAUTotals = (data: EnvironmentsMap) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, envData]) => [key, getTotalValue(envData)])
  );
};

// Function to limit data to the current date (March 12 for MTD view)
export const limitDataToCurrentDate = (data: EnvironmentsMap): EnvironmentsMap => {
  const result: EnvironmentsMap = {};
  const currentDate = new Date(2024, 2, 12); // March 12, 2024
  
  Object.keys(data).forEach(env => {
    result[env] = data[env].map(dayData => {
      // Parse the date from the day string
      const dateParts = dayData.day.split(' ');
      if (dateParts.length !== 2) return dayData; // Not in the expected format
      
      const month = getMonthNumber(dateParts[0]);
      const day = parseInt(dateParts[1], 10);
      
      // Create a date object for comparison
      const dataDate = new Date(2024, month, day);
      
      // If the date is after the current date, set value to null
      return {
        day: dayData.day,
        value: dataDate > currentDate ? null : dayData.value
      };
    });
  });
  
  return result;
};

// Helper function to convert month abbreviation to month number
const getMonthNumber = (monthAbbr: string): number => {
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return months[monthAbbr as keyof typeof months] || 0;
};

// Function to ensure data doesn't exceed the threshold
export const capEnvironmentsData = (data: EnvironmentsMap, threshold: number = USER_LIMIT): EnvironmentsMap => {
  // First, calculate the total for each day across all environments
  const dailyTotals: { [key: string]: number } = {};
  
  // Get all unique day values
  const allDays = new Set<string>();
  Object.values(data).forEach(envData => {
    envData.forEach(dayData => {
      if (dayData.day) {
        allDays.add(dayData.day);
      }
    });
  });
  
  // Calculate daily totals across environments
  allDays.forEach(day => {
    let total = 0;
    Object.values(data).forEach(envData => {
      const dayData = envData.find(d => d.day === day);
      if (dayData && dayData.value !== null) {
        total += dayData.value;
      }
    });
    dailyTotals[day] = total;
  });
  
  // Cap the data proportionally if it exceeds the threshold
  const result: EnvironmentsMap = {};
  
  Object.keys(data).forEach(env => {
    result[env] = data[env].map(dayData => {
      if (dayData.value === null) return dayData;
      
      const total = dailyTotals[dayData.day];
      if (total > threshold) {
        // Scale down proportionally
        const scaleFactor = threshold / total;
        return {
          day: dayData.day,
          value: Math.round(dayData.value * scaleFactor)
        };
      }
      return dayData;
    });
  });
  
  return result;
};
