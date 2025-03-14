
import { calculatePercentChange } from "@/utils/dataTransformers";
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";

export interface ExperimentGroup {
  id: string;
  title: string;
  value: number;
  data: Array<{ day: string; value: number }>;
  percentChange: number;
}

export function generateExperimentData(
  timeRange: TimeRangeType,
  currentDate: Date,
  customDateRange?: DateRange
) {
  // Mock data generation based on time range
  const data = {
    current: {
      experimentA: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      })),
      experimentB: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      })),
      experimentC: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      }))
    },
    previous: {
      experimentA: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      })),
      experimentB: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      })),
      experimentC: Array.from({ length: 30 }, (_, i) => ({
        day: (i + 1).toString(),
        value: Math.floor(Math.random() * 100)
      }))
    },
    currentTotals: {
      experimentA: 2500,
      experimentB: 1800,
      experimentC: 3200
    },
    previousTotals: {
      experimentA: 2300,
      experimentB: 1650,
      experimentC: 2900
    }
  };

  return data;
}

export function processExperimentData(serviceData: any, sortDirection: 'desc' | 'asc') {
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
      day: timeRange === 'rolling-30-day'
        ? dataPoint.day
        : timeRange === 'last-12-months'
          ? serviceData.current[firstKey][index].day
          : (index + 1).toString(),
      value: totalValue as number // Ensure the value is explicitly typed as number
    };
  });
}
