
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

// Function to fetch specific diagnostic data
const fetchDiagnosticData = (type: string, timeRange: TimeRangeType, customDateRange?: DateRange) => {
  // Generate mock data for each diagnostic type
  // This would be replaced with actual API calls in a real app
  const generateDiagnosticData = () => {
    const data: Array<{ day: string; value: number }> = [];
    const now = new Date();
    const days = timeRange === '3-day' ? 3 : 
                timeRange === 'rolling-30-day' ? 30 : 
                timeRange === 'last-12-months' ? 365 : 30;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const day = date.toISOString().split('T')[0];
      
      // Generate random values based on the diagnostic type
      let baseValue = 0;
      switch (type) {
        case 'client-connections':
          baseValue = 2000 + Math.floor(Math.random() * 1000);
          break;
        case 'server-mau':
          baseValue = 8000 + Math.floor(Math.random() * 2000);
          break;
        case 'peak-server-connections':
          baseValue = 5000 + Math.floor(Math.random() * 1500);
          break;
        case 'service-requests':
        case 'service-connections':  // Added support for service-connections
          baseValue = 5000 + Math.floor(Math.random() * 1500);
          break;
        default:
          baseValue = 1000 + Math.floor(Math.random() * 500);
      }
      
      data.push({
        day,
        value: baseValue
      });
    }
    
    return data;
  };
  
  return generateDiagnosticData();
};

export const useServiceData = (
  selectedMonthOrType: number | string,
  groupingOrViewType?: GroupingType | ViewType,
  timeRange?: TimeRangeType,
  customDateRange?: DateRange
) => {
  // Check if first parameter is a string (diagnostic type) or number (selected month)
  const isDiagnosticMode = typeof selectedMonthOrType === 'string';
  
  if (isDiagnosticMode) {
    const diagnosticType = selectedMonthOrType;
    const viewType = groupingOrViewType as ViewType;
    
    return useQuery({
      queryKey: ['diagnostic-data', diagnosticType, viewType, timeRange, customDateRange],
      queryFn: () => {
        const data = fetchDiagnosticData(diagnosticType, timeRange || 'month-to-date', customDateRange);
        return {
          data
        };
      }
    });
  } else {
    // Original behavior for MAU data
    const selectedMonth = selectedMonthOrType as number;
    const grouping = groupingOrViewType as GroupingType;
    
    const currentDate = new Date(new Date().getFullYear(), selectedMonth);
    const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

    return useQuery({
      queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange, customDateRange],
      queryFn: () => {
        if (grouping === 'all') {
          return handleAllDimensionsData(timeRange || 'month-to-date', customDateRange);
        }
        
        return handleSpecificDimensionData(grouping, timeRange || 'month-to-date', customDateRange);
      }
    });
  }
};
