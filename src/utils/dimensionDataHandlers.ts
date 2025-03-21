
import { getMockData } from "./mockDataGenerator";
import { getTotalValue } from "./dataTransformers";
import { 
  generateLast12MonthsData, 
  generateRolling30DayData, 
  generate3DayData,
  generate7DayData,
  combineDataSets, 
  processCombinedData 
} from "./timeRangeDataGenerators";
import { TimeRangeType, GroupingType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";
import { format } from "date-fns";

// Handle 'all' dimensions data
export const handleAllDimensionsData = (
  timeRange: TimeRangeType, 
  selectedMonth: number = new Date().getMonth(),
  selectedYear: number = new Date().getFullYear(),
  customDateRange?: DateRange
) => {
  // Use selected month and year for generating data
  const selectedDate = new Date(selectedYear, selectedMonth);
  
  const environmentData = getMockData('environment', selectedDate);
  const relayIdData = getMockData('relayId', selectedDate);
  const userAgentData = getMockData('userAgent', selectedDate);
  
  if (timeRange === 'last-12-months') {
    const environmentLast12Months = generateLast12MonthsData(environmentData, selectedYear);
    const relayIdLast12Months = generateLast12MonthsData(relayIdData, selectedYear);
    const userAgentLast12Months = generateLast12MonthsData(userAgentData, selectedYear);
    
    const combined = combineDataSets([environmentLast12Months, relayIdLast12Months, userAgentLast12Months]);
    return processCombinedData(combined);
  }
  
  if (timeRange === 'rolling-30-day') {
    const environmentRolling30Days = generateRolling30DayData(environmentData, selectedDate);
    const relayIdRolling30Days = generateRolling30DayData(relayIdData, selectedDate);
    const userAgentRolling30Days = generateRolling30DayData(userAgentData, selectedDate);
    
    const combined = combineDataSets([environmentRolling30Days, relayIdRolling30Days, userAgentRolling30Days]);
    return processCombinedData(combined);
  }
  
  if (timeRange === '3-day') {
    const environment3Day = generate3DayData(environmentData, selectedDate);
    const relayId3Day = generate3DayData(relayIdData, selectedDate);
    const userAgent3Day = generate3DayData(userAgentData, selectedDate);
    
    const combined = combineDataSets([environment3Day, relayId3Day, userAgent3Day]);
    return processCombinedData(combined);
  }
  
  if (timeRange === '7-day') {
    const environment7Day = generate7DayData(environmentData, selectedDate);
    const relayId7Day = generate7DayData(relayIdData, selectedDate);
    const userAgent7Day = generate7DayData(userAgentData, selectedDate);
    
    const combined = combineDataSets([environment7Day, relayId7Day, userAgent7Day]);
    return processCombinedData(combined);
  }
  
  if (timeRange === 'custom' && customDateRange) {
    // For custom date range, use the month-to-date data for now
    // In a real app, you would fetch data for the specific date range
    const combined = combineDataSets([environmentData, relayIdData, userAgentData]);
    return processCombinedData(combined);
  }
  
  // Default for month-to-date
  const combined = combineDataSets([environmentData, relayIdData, userAgentData]);
  return processCombinedData(combined);
};

// Handle specific dimension data
export const handleSpecificDimensionData = (
  grouping: GroupingType, 
  timeRange: TimeRangeType, 
  selectedMonth: number = new Date().getMonth(),
  selectedYear: number = new Date().getFullYear(),
  customDateRange?: DateRange
) => {
  // Use selected month and year for generating data
  const selectedDate = new Date(selectedYear, selectedMonth);
  
  // Convert the grouping string to the correct type for getMockData
  const current = getMockData(grouping as 'environment' | 'relayId' | 'userAgent', selectedDate);
  const previous = getMockData(grouping as 'environment' | 'relayId' | 'userAgent', selectedDate);

  if (timeRange === 'last-12-months') {
    const last12MonthsData = generateLast12MonthsData(current, selectedYear);
    return {
      current: last12MonthsData,
      previous,
      currentTotals: Object.fromEntries(
        Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data as any)])
      ),
      previousTotals: Object.fromEntries(
        Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
      )
    };
  }
  
  if (timeRange === 'rolling-30-day') {
    const rolling30DayData = generateRolling30DayData(current, selectedDate);
    return {
      current: rolling30DayData,
      previous,
      currentTotals: Object.fromEntries(
        Object.entries(rolling30DayData).map(([key, data]) => [key, getTotalValue(data as any)])
      ),
      previousTotals: Object.fromEntries(
        Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
      )
    };
  }
  
  if (timeRange === '3-day') {
    const data3Day = generate3DayData(current, selectedDate);
    return {
      current: data3Day,
      previous,
      currentTotals: Object.fromEntries(
        Object.entries(data3Day).map(([key, data]) => [key, getTotalValue(data as any)])
      ),
      previousTotals: Object.fromEntries(
        Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
      )
    };
  }
  
  if (timeRange === '7-day') {
    const data7Day = generate7DayData(current, selectedDate);
    return {
      current: data7Day,
      previous,
      currentTotals: Object.fromEntries(
        Object.entries(data7Day).map(([key, data]) => [key, getTotalValue(data as any)])
      ),
      previousTotals: Object.fromEntries(
        Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
      )
    };
  }
  
  if (timeRange === 'custom' && customDateRange) {
    // For custom date range, use the month-to-date data for now
    // In a real app, you would fetch data for the specific date range
    return {
      current,
      previous,
      currentTotals: Object.fromEntries(
        Object.entries(current).map(([key, data]) => [key, getTotalValue(data)])
      ),
      previousTotals: Object.fromEntries(
        Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
      )
    };
  }

  // Default for month-to-date
  return {
    current,
    previous,
    currentTotals: Object.fromEntries(
      Object.entries(current).map(([key, data]) => [key, getTotalValue(data)])
    ),
    previousTotals: Object.fromEntries(
      Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
    )
  };
};
