
import { getMockData } from "../mockDataGenerator";
import { getTotalValue } from "../dataTransformers";
import { TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";
import { format } from "date-fns";
import { handleTimeRangeForAllDimensions } from "./timeRangeHandlers";

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
  
  return handleTimeRangeForAllDimensions(
    timeRange, 
    environmentData, 
    relayIdData, 
    userAgentData, 
    selectedDate, 
    customDateRange
  );
};
