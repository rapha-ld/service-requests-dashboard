
import { calculatePercentChange } from "@/utils/dataTransformers";
import { TimeRangeType } from "@/hooks/useExperimentData";

interface ExperimentGroup {
  id: string;
  title: string;
  value: number;
  data: Array<{ day: string; value: number }>;
  percentChange: number;
}

export function processExperimentData(serviceData: any, sortDirection: 'desc' | 'asc') {
  if (!serviceData) return { groups: [], sortedGroups: [] };

  const groups = Object.entries(serviceData.current).map(([id, data]) => ({
    id,
    title: id,
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

  return { groups, sortedGroups };
}

export function calculateMaxValue(
  groups: ExperimentGroup[],
  viewType: 'net-new' | 'cumulative'
) {
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
}

export function getExperimentsTotalData(
  serviceData: any,
  timeRange: TimeRangeType
) {
  if (!serviceData || !serviceData.current) return [];
  
  return Object.values(serviceData.current)[0].map((dataPoint: any, index: number) => ({
    day: timeRange === 'rolling-30-day'
      ? dataPoint.day
      : timeRange === 'last-12-months'
        ? Object.values(serviceData.current)[0][index].day
        : (index + 1).toString(),
    value: Object.values(serviceData.current).reduce((sum: number, data: any) => sum + data[index].value, 0)
  }));
}
