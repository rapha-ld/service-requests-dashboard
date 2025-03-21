
import { calculatePercentChange } from "@/utils/dataTransformers";
import { ExperimentGroup, ExperimentData } from "./types";

// Process experiment data for display
export function processExperimentData(
  serviceData: ExperimentData | null | undefined, 
  sortDirection: 'desc' | 'asc'
): { 
  groups: ExperimentGroup[], 
  sortedGroups: ExperimentGroup[] 
} {
  if (!serviceData) return { groups: [], sortedGroups: [] };

  const groups = Object.entries(serviceData.current).map(([id, data]) => ({
    id,
    title: id,
    value: serviceData.currentTotals[id],
    data: data as Array<{ day: string; value: number }>,
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

// Get combined data for all experiments
export function getExperimentsTotalData(
  serviceData: ExperimentData | null | undefined,
  timeRange: string
): Array<{ day: string; value: number }> {
  if (!serviceData || !serviceData.current) return [];
  
  const firstKey = Object.keys(serviceData.current)[0];
  if (!firstKey || !Array.isArray(serviceData.current[firstKey])) {
    return [];
  }
  
  return serviceData.current[firstKey].map((dataPoint: any, index: number) => {
    // Calculate the total value by summing up values from all environments
    const totalValue = Object.values(serviceData.current).reduce((sum: number, data: any) => {
      if (Array.isArray(data) && data[index] && typeof data[index].value === 'number') {
        return sum + data[index].value;
      }
      return sum;
    }, 0);

    return {
      day: ['rolling-30-day', 'last-12-months', '3-day', '7-day'].includes(timeRange)
        ? dataPoint.day
        : (index + 1).toString(),
      value: totalValue as number
    };
  });
}
