
import { calculatePercentChange } from "./dataTransformers";

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
  viewType: 'net-new' | 'cumulative';
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
  viewType: 'net-new' | 'cumulative'
) => {
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
};

export const getAllEnvironmentsData = (
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent',
  serviceData: any,
  timeRange: 'month-to-date' | 'last-12-months',
  sortedGroups: ChartGroup[]
) => {
  return grouping === 'all'
    ? sortedGroups[0]?.data || []
    : Object.values(serviceData.current)[0].map((_, index: number) => ({
        day: timeRange === 'last-12-months' 
          ? Object.values(serviceData.current)[0][index].day
          : (index + 1).toString(),
        value: Object.values(serviceData.current).reduce((sum, data: any) => sum + data[index].value, 0)
      }));
};
