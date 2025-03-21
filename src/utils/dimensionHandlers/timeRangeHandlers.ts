
import { generateRolling30DayData, generateLast12MonthsData, generate3DayData, generate7DayData } from "../timeRangeDataGenerators";
import { getMockData } from "../mockDataGenerator";
import { combineDataSets, processCombinedData } from "../timeRangeDataGenerators";
import { generateDailyData } from "../chartDataGenerator";
import { format } from "date-fns";
import { DateRange } from "@/types/mauTypes";

// Generate month-to-date data for the specified month
export const generateMonthToDateData = (data: Record<string, any[]>, selectedDate: Date) => {
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();
  
  console.log(`Generating MTD data for ${selectedMonth + 1}/${selectedYear}`);
  
  // Create new data for each dimension with days from the selected month
  return Object.fromEntries(
    Object.entries(data).map(([key, _]) => {
      // Generate daily values for the selected month
      const targetValue = Math.floor(5000 + Math.random() * 5000); // Random target between 5000-10000
      const monthData = generateDailyData(targetValue, 'steady', selectedDate);
      
      return [key, monthData];
    })
  );
};

// Handle time range data for all dimensions
export const handleTimeRangeForAllDimensions = (
  timeRange: string,
  environmentData: Record<string, any[]>,
  relayIdData: Record<string, any[]>,
  userAgentData: Record<string, any[]>,
  selectedDate: Date,
  customDateRange?: DateRange
) => {
  console.log(`Processing time range ${timeRange} for date: ${format(selectedDate, 'yyyy-MM-dd')}`);
  
  if (timeRange === 'last-12-months') {
    const selectedYear = selectedDate.getFullYear();
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
  
  // Default for month-to-date - Generate data for the selected month
  const environmentMTD = generateMonthToDateData(environmentData, selectedDate);
  const relayIdMTD = generateMonthToDateData(relayIdData, selectedDate);
  const userAgentMTD = generateMonthToDateData(userAgentData, selectedDate);
  
  const combined = combineDataSets([environmentMTD, relayIdMTD, userAgentMTD]);
  return processCombinedData(combined);
};

// Handle time range data for a specific dimension
export const handleTimeRangeForDimension = (
  timeRange: string,
  currentData: Record<string, any[]>,
  previousData: Record<string, any[]>,
  selectedDate: Date,
  customDateRange?: DateRange
) => {
  console.log(`Processing dimension time range ${timeRange} for date: ${format(selectedDate, 'yyyy-MM-dd')}`);
  
  if (timeRange === 'last-12-months') {
    const selectedYear = selectedDate.getFullYear();
    const last12MonthsData = generateLast12MonthsData(currentData, selectedYear);
    return last12MonthsData;
  }
  
  if (timeRange === 'rolling-30-day') {
    const rolling30DayData = generateRolling30DayData(currentData, selectedDate);
    return rolling30DayData;
  }
  
  if (timeRange === '3-day') {
    const data3Day = generate3DayData(currentData, selectedDate);
    return data3Day;
  }
  
  if (timeRange === '7-day') {
    const data7Day = generate7DayData(currentData, selectedDate);
    return data7Day;
  }
  
  if (timeRange === 'custom' && customDateRange) {
    // For custom date range, use the month-to-date data for now
    // In a real app, you would fetch data for the specific date range
    return currentData;
  }

  // Default for month-to-date - Generate data for the selected month
  return generateMonthToDateData(currentData, selectedDate);
};
