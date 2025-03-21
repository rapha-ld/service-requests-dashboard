
import { calculatePercentChange } from "./dataTransformers";
import { TimeRangeType, ViewType } from "@/types/serviceData";

export type ChartGroup = {
  id: string;
  title: string;
  value: number;
  data: Array<{ day: string; value: number }>;
  percentChange: number;
};

export const processServiceData = (
  serviceData: any,
  sortDirection: 'desc' | 'asc'
): {
  sortedGroups: ChartGroup[];
  allEnvironmentsData: Array<{ day: string; value: number }>;
  maxValue: number;
  viewType: ViewType;
} => {
  if (!serviceData) return { sortedGroups: [], allEnvironmentsData: [], maxValue: 0, viewType: 'net-new' };

  const groups = Object.entries(serviceData.current).map(([id, data]: [string, any]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    value: serviceData.currentTotals[id],
    data,
    percentChange: calculatePercentChange(
      serviceData.currentTotals[id],
      serviceData.previousTotals[id]
    )
  }));

  const sortedGroups = groups.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  return {
    sortedGroups,
    allEnvironmentsData: [],
    maxValue: 0,
    viewType: 'net-new'
  };
};

export const calculateMaxValue = (
  groups: ChartGroup[],
  viewType: ViewType
) => {
  if (viewType === 'rolling-30d') {
    // For rolling 30d, find the maximum value across all data points
    return Math.max(...groups.flatMap(env => env.data.map(d => d.value)));
  }
  
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
};

export const getAllEnvironmentsData = (
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent',
  serviceData: any,
  timeRange: TimeRangeType,
  sortedGroups: ChartGroup[]
) => {
  if (grouping === 'all') {
    // Make sure we're properly accessing the data array
    return sortedGroups[0]?.data || [];
  } else {
    // Access serviceData.current safely as an object with indexable properties
    const currentData = serviceData.current as Record<string, Array<{ day: string; value: number }>>;
    const firstKey = Object.keys(currentData)[0];
    
    if (!firstKey || !currentData[firstKey] || !Array.isArray(currentData[firstKey])) {
      return [];
    }
    
    return currentData[firstKey].map((dataPoint, index: number) => {
      // For rolling-30-day or custom timeframe, use the exact same day format from the data
      const day = timeRange === 'rolling-30-day' || timeRange === 'custom'
        ? dataPoint.day  // Use the exact day as in the original data
        : timeRange === 'last-12-months' 
          ? currentData[firstKey][index].day
          : (index + 1).toString();
        
      // Safely sum all values at this index across all entries in current
      const value = Object.values(currentData).reduce((sum, data) => {
        if (Array.isArray(data) && data[index] && typeof data[index].value === 'number') {
          return sum + data[index].value;
        }
        return sum;
      }, 0);
      
      return { day, value };
    });
  }
};
