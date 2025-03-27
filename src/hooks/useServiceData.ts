
import { useQuery } from "@tanstack/react-query";
import { handleAllDimensionsData, handleSpecificDimensionData } from "@/utils/dimensionDataHandlers";
import { GroupingType, TimeRangeType, ViewType, ChartType, ServiceData, DiagnosticData } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export type { GroupingType, TimeRangeType, ViewType, ChartType };

// Function to fetch specific diagnostic data
const fetchDiagnosticData = (type: string, timeRange: TimeRangeType, customDateRange?: DateRange) => {
  // Generate mock data for each diagnostic type
  // This would be replaced with actual API calls in a real app
  const generateDiagnosticData = () => {
    const data: Array<{ day: string; value: number }> = [];
    const now = new Date();
    
    // For 3-day view, provide hourly data instead of daily
    if (timeRange === '3-day') {
      // Generate hourly data for the last 3 days (72 hours)
      for (let h = 72; h >= 0; h--) {
        const date = new Date(now);
        date.setHours(date.getHours() - h);
        
        // Format as "Sep 21, 14:00" for hourly data
        const formattedDay = date.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        }) + ", " + date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        // Generate random values based on the diagnostic type
        let baseValue = 0;
        switch (type) {
          case 'client-connections':
            baseValue = 1500 + Math.floor(Math.random() * 800);
            break;
          case 'server-mau':
            baseValue = 7000 + Math.floor(Math.random() * 1500);
            break;
          case 'peak-server-connections':
            baseValue = 4000 + Math.floor(Math.random() * 1200);
            break;
          case 'service-requests':
            baseValue = 12000 + Math.floor(Math.random() * 4000);
            break;
          default:
            baseValue = 800 + Math.floor(Math.random() * 400);
        }
        
        data.push({
          day: formattedDay,
          value: baseValue
        });
      }
    } else {
      // Standard daily data for other time ranges
      const days = timeRange === 'rolling-30-day' ? 30 : 
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
            baseValue = 15000 + Math.floor(Math.random() * 5000);
            break;
          default:
            baseValue = 1000 + Math.floor(Math.random() * 500);
        }
        
        data.push({
          day,
          value: baseValue
        });
      }
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
  // Define threshold values for different metrics
  const getThreshold = (diagnosticType: string): number | undefined => {
    switch (diagnosticType) {
      case 'service-requests':
        return 300000; // 300k threshold for service requests
      default:
        return undefined;
    }
  };

  // Check if first parameter is a string (diagnostic type) or number (selected month)
  const isDiagnosticMode = typeof selectedMonthOrType === 'string';
  
  if (isDiagnosticMode) {
    const diagnosticType = selectedMonthOrType as string;
    const viewType = groupingOrViewType as ViewType;
    
    return useQuery({
      queryKey: ['diagnostic-data', diagnosticType, viewType, timeRange, customDateRange],
      queryFn: () => {
        const data = fetchDiagnosticData(diagnosticType, timeRange || 'month-to-date', customDateRange);
        return {
          data,
          threshold: getThreshold(diagnosticType)
        } as DiagnosticData;
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
          return handleAllDimensionsData(timeRange || 'month-to-date', customDateRange) as ServiceData;
        }
        
        return handleSpecificDimensionData(grouping, timeRange || 'month-to-date', customDateRange) as ServiceData;
      }
    });
  }
};
