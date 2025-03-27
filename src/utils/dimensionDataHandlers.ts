
import { getMockData } from "./mockDataGenerator";
import { getTotalValue } from "./dataTransformers";
import { 
  generateLast12MonthsData, 
  generateRolling30DayData, 
  generate3DayData,
  combineDataSets, 
  processCombinedData 
} from "./timeRangeDataGenerators";
import { TimeRangeType, GroupingType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

// Handle 'all' dimensions data
export const handleAllDimensionsData = (timeRange: TimeRangeType, customDateRange?: DateRange) => {
  const environmentData = getMockData('environment');
  const relayIdData = getMockData('relayId');
  const userAgentData = getMockData('userAgent');
  
  // Use appropriate time range data generator based on the selected time range
  // Each generator uses the same consistent historical data pattern with different window sizes
  if (timeRange === 'last-12-months') {
    const environmentLast12Months = generateLast12MonthsData(environmentData);
    const relayIdLast12Months = generateLast12MonthsData(relayIdData);
    const userAgentLast12Months = generateLast12MonthsData(userAgentData);
    
    const combined = combineDataSets([environmentLast12Months, relayIdLast12Months, userAgentLast12Months]);
    return processCombinedData(combined);
  }
  
  if (timeRange === 'rolling-30-day') {
    const environmentRolling30Days = generateRolling30DayData(environmentData);
    const relayIdRolling30Days = generateRolling30DayData(relayIdData);
    const userAgentRolling30Days = generateRolling30DayData(userAgentData);
    
    const combined = combineDataSets([environmentRolling30Days, relayIdRolling30Days, userAgentRolling30Days]);
    return processCombinedData(combined);
  }
  
  if (timeRange === '3-day') {
    const environment3Day = generate3DayData(environmentData);
    const relayId3Day = generate3DayData(relayIdData);
    const userAgent3Day = generate3DayData(userAgentData);
    
    const combined = combineDataSets([environment3Day, relayId3Day, userAgent3Day]);
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
export const handleSpecificDimensionData = (grouping: GroupingType, timeRange: TimeRangeType, customDateRange?: DateRange) => {
  // Convert the grouping string to the correct type for getMockData
  const current = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');
  const previous = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');

  // Use appropriate time range data generator based on the selected time range
  // Each generator uses the same consistent historical data pattern with different window sizes
  if (timeRange === 'last-12-months') {
    const last12MonthsData = generateLast12MonthsData(current);
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
    const rolling30DayData = generateRolling30DayData(current);
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
    const data3Day = generate3DayData(current);
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
