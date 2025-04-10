
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
  sortedGroups: ChartGroup[],
  hourlyData?: boolean
) => {
  // Always calculate the combined data regardless of grouping
  // Access serviceData.current safely as an object with indexable properties
  const currentData = serviceData.current as Record<string, Array<{ day: string; value: number }>>;
  const firstKey = Object.keys(currentData)[0];
  
  if (!firstKey || !currentData[firstKey] || !Array.isArray(currentData[firstKey])) {
    return [];
  }
  
  // Create a consistent template array based on the first dataset's structure
  const templateData = currentData[firstKey].map((dataPoint, index: number) => {
    // For rolling-30-day, custom timeframe, or hourly data, use the exact same day format from the data
    const day = timeRange === 'rolling-30-day' || timeRange === 'custom' || hourlyData
      ? dataPoint.day  // Use the exact day as in the original data
      : timeRange === 'last-12-months' 
        ? currentData[firstKey][index].day
        : (index + 1).toString();
    
    return { day, value: 0 };
  });
  
  // Sum up values across all dimensions for each day point
  Object.values(currentData).forEach(data => {
    if (Array.isArray(data)) {
      data.forEach((point, index) => {
        if (index < templateData.length && typeof point.value === 'number') {
          templateData[index].value += point.value;
        }
      });
    }
  });
  
  return templateData;
};
