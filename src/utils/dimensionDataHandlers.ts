
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
import { limitDataToCurrentDate } from "@/utils/mauDataFormatter";

// Handle 'all' dimensions data
export const handleAllDimensionsData = (
  timeRange: TimeRangeType, 
  selectedDate: Date = new Date(),
  customDateRange?: DateRange
) => {
  const environmentData = getMockData('environment');
  const relayIdData = getMockData('relayId');
  const userAgentData = getMockData('userAgent');
  
  if (timeRange === 'last-12-months') {
    const environmentLast12Months = generateLast12MonthsData(environmentData, selectedDate);
    const relayIdLast12Months = generateLast12MonthsData(relayIdData, selectedDate);
    const userAgentLast12Months = generateLast12MonthsData(userAgentData, selectedDate);
    
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
  const result = processCombinedData(combined);
  
  // Limit data to the current date for the selected month
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() && 
                          selectedDate.getFullYear() === today.getFullYear();
  
  if (isCurrentMonth) {
    // Only limit to today's date if we're viewing the current month
    result.current.total = limitDataToSelectedMonthDate(result.current.total, selectedDate);
  } else {
    // For past months, show the full month
    // No limit needed
  }
  
  return result;
};

// Handle specific dimension data
export const handleSpecificDimensionData = (
  grouping: GroupingType, 
  timeRange: TimeRangeType, 
  selectedDate: Date = new Date(),
  customDateRange?: DateRange
) => {
  // Convert the grouping string to the correct type for getMockData
  const current = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');
  const previous = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');

  if (timeRange === 'last-12-months') {
    const last12MonthsData = generateLast12MonthsData(current, selectedDate);
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
  const result = {
    current,
    previous,
    currentTotals: Object.fromEntries(
      Object.entries(current).map(([key, data]) => [key, getTotalValue(data)])
    ),
    previousTotals: Object.fromEntries(
      Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
    )
  };
  
  // Limit data to the current date for the selected month
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() && 
                          selectedDate.getFullYear() === today.getFullYear();
  
  if (isCurrentMonth) {
    // If viewing current month, limit data to today
    Object.keys(result.current).forEach(key => {
      result.current[key] = limitDataToSelectedMonthDate(result.current[key], selectedDate);
    });
  }
  
  return result;
};

// Helper function to limit data to the current date of a selected month
const limitDataToSelectedMonthDate = (data: Array<{ day: string; value: number | null }>, selectedDate: Date): Array<{ day: string; value: number | null }> => {
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() && 
                          selectedDate.getFullYear() === today.getFullYear();
  
  if (!isCurrentMonth) {
    // If not viewing the current month, return all data
    return data;
  }
  
  return data.map(item => {
    // Parse the day from the data
    const dayParts = item.day.split(' ');
    if (dayParts.length !== 2) return item; // Not in the expected format
    
    const day = parseInt(dayParts[1]);
    const monthName = dayParts[0];
    
    // Create a date to compare
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = months.findIndex(m => m === monthName);
    if (monthIndex === -1) return item;
    
    const itemDate = new Date(today.getFullYear(), monthIndex, day);
    
    // If this date is after today, set value to null
    return {
      day: item.day,
      value: itemDate > today ? null : item.value
    };
  });
};
