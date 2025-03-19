
import { EnvironmentsMap } from "@/types/mauTypes";
import { getTotalValue } from "./dataTransformers";

// Client MAU value from the Overview page
const CLIENT_MAU_VALUE = 18450;
// User limit threshold
const USER_LIMIT = 25000;

// Scale data to match the client MAU value
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

// Adjust data for rolling 30-day period
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

// Calculate MAU totals across environments
export const calculateMAUTotals = (data: EnvironmentsMap) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, envData]) => [key, getTotalValue(envData)])
  );
};

// Ensure data doesn't exceed the threshold
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
