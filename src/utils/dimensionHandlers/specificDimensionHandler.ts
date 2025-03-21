
import { getMockData } from "../mockDataGenerator";
import { getTotalValue } from "../dataTransformers";
import { GroupingType, TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";
import { format } from "date-fns";
import { handleTimeRangeForDimension } from "./timeRangeHandlers";

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

  const timeRangeData = handleTimeRangeForDimension(
    timeRange, 
    current, 
    previous, 
    selectedDate, 
    customDateRange
  );

  return {
    current: timeRangeData,
    previous,
    currentTotals: Object.fromEntries(
      Object.entries(timeRangeData).map(([key, data]) => [key, getTotalValue(data as any)])
    ),
    previousTotals: Object.fromEntries(
      Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
    )
  };
};
