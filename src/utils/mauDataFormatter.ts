
import { format, subMonths, subDays } from "date-fns";
import { EnvironmentsMap, MAUDataResult } from "@/types/mauTypes";
import { getMockMAUData } from "./mauDataGenerator";
import { getTotalValue } from "./dataTransformers";

// Client MAU value from the Overview page
const CLIENT_MAU_VALUE = 18450;

export const formatRolling30DayData = (currentData: EnvironmentsMap, safeProject: string) => {
  const rolling30DayData: EnvironmentsMap = {};
  
  const dateStrings = Array.from({ length: 30 }, (_, i) => 
    format(subDays(new Date(), 29 - i), 'MMM d')
  );
  
  Object.keys(currentData).forEach(key => {
    rolling30DayData[key] = dateStrings.map(day => ({
      day,
      value: Math.floor((CLIENT_MAU_VALUE / 30) * (0.8 + Math.random() * 0.4))
    }));
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
