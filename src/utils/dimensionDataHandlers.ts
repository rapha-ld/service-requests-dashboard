
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
import { generateDailyData } from "./chartDataGenerator";

// Handle 'all' dimensions data
export const handleAllDimensionsData = (
  timeRange: TimeRangeType, 
  selectedMonth: number = new Date().getMonth(),
  selectedYear: number = new Date().getFullYear(),
  customDateRange?: DateRange
) => {
  // Use selected month and year for generating data
  const selectedDate = new Date(selectedYear, selectedMonth);
  console.log(`Generating all dimensions data for date: ${format(selectedDate, 'yyyy-MM-dd')}`);
  
  // Update the calls to match getMockData's signature
  const environmentData = getMockData('environment');
  const relayIdData = getMockData('relayId');
  const userAgentData = getMockData('userAgent');
  
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
  
  // Default for month-to-date - Generate data for the selected month
  // We need to modify this to generate data based on the selected month
  const environmentMTD = generateMonthToDateData(environmentData, selectedDate);
  const relayIdMTD = generateMonthToDateData(relayIdData, selectedDate);
  const userAgentMTD = generateMonthToDateData(userAgentData, selectedDate);
  
  const combined = combineDataSets([environmentMTD, relayIdMTD, userAgentMTD]);
  return processCombinedData(combined);
};

// Generate month-to-date data for the specified month
const generateMonthToDateData = (data: Record<string, any[]>, selectedDate: Date) => {
  // Create new data for each dimension with days from the selected month
  return Object.fromEntries(
    Object.entries(data).map(([key, _]) => {
      // Get month name for display
      const monthName = format(selectedDate, 'MMM');
      const year = selectedDate.getFullYear();
      const daysInMonth = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
      
      // Generate daily values for the selected month
      const targetValue = Math.floor(5000 + Math.random() * 5000); // Random target between 5000-10000
      const monthData = generateDailyData(targetValue, 'steady', selectedDate);
      
      return [key, monthData];
    })
  );
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
  console.log(`Generating specific dimension data for date: ${format(selectedDate, 'yyyy-MM-dd')}`);
  
  // Update the calls to match getMockData's signature
  // Convert the grouping string to the correct type for getMockData
  const current = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');
  const previous = getMockData(grouping as 'environment' | 'relayId' | 'userAgent');

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

  // Default for month-to-date - Generate data for the selected month
  const dataMTD = generateMonthToDateData(current, selectedDate);
  
  return {
    current: dataMTD,
    previous,
    currentTotals: Object.fromEntries(
      Object.entries(dataMTD).map(([key, data]) => [key, getTotalValue(data as any)])
    ),
    previousTotals: Object.fromEntries(
      Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
    )
  };
};

