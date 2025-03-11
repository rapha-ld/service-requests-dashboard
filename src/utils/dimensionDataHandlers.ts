
import { getMockData } from "./mockDataGenerator";
import { getTotalValue } from "./dataTransformers";
import { generateLast12MonthsData, generateRolling30DayData, combineDataSets, processCombinedData } from "./timeRangeDataGenerators";
import { TimeRangeType } from "@/types/serviceData";

// Handle 'all' dimensions data
export const handleAllDimensionsData = (timeRange: TimeRangeType) => {
  const environmentData = getMockData('environment');
  const relayIdData = getMockData('relayId');
  const userAgentData = getMockData('userAgent');
  
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
  
  const combined = combineDataSets([environmentData, relayIdData, userAgentData]);
  return processCombinedData(combined);
};

// Handle specific dimension data
export const handleSpecificDimensionData = (grouping: string, timeRange: TimeRangeType) => {
  const current = getMockData(grouping);
  const previous = getMockData(grouping);

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
