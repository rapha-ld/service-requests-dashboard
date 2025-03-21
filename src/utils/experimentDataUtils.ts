import { calculatePercentChange } from "@/utils/dataTransformers";
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";
import { format, subDays, isAfter, getDate, getMonth, subMonths } from "date-fns";

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
  if (timeRange === 'last-12-months') {
    // Generate monthly data for the last 12 months
    const today = new Date();
    
    const generateMonthlyData = () => {
      return Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(today, 11 - i);
        
        return {
          day: format(date, 'MMM'),
          value: Math.floor(Math.random() * 1000)
        };
      });
    };
    
    const experimentA = generateMonthlyData();
    const experimentB = generateMonthlyData();
    const experimentC = generateMonthlyData();
    
    const calculateTotal = (data: Array<{ day: string; value: number }>) => {
      return data.reduce((sum, item) => sum + (item.value || 0), 0);
    };
    
    return {
      current: {
        experimentA,
        experimentB,
        experimentC
      },
      previous: {
        experimentA: Array.from({ length: 12 }, () => ({
          day: "month",
          value: Math.floor(Math.random() * 1000)
        })),
        experimentB: Array.from({ length: 12 }, () => ({
          day: "month",
          value: Math.floor(Math.random() * 1000)
        })),
        experimentC: Array.from({ length: 12 }, () => ({
          day: "month",
          value: Math.floor(Math.random() * 1000)
        }))
      },
      currentTotals: {
        experimentA: calculateTotal(experimentA),
        experimentB: calculateTotal(experimentB),
        experimentC: calculateTotal(experimentC)
      },
      previousTotals: {
        experimentA: 8500,
        experimentB: 7200,
        experimentC: 9800
      }
    };
  }
  
  if (timeRange === '3-day') {
    // Generate 3-day data
    const today = new Date();
    
    const generateData = () => {
      // Calculate how many days we are into the current month
      const currentDay = today.getDate();
      const daysIntoMonth = currentDay - 1; // Days before today this month
      
      return Array.from({ length: 3 }, (_, i) => {
        const date = subDays(today, 2 - i);
        const isFutureDate = isAfter(date, today);
        
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * 100)
        };
      });
    };
    
    const experimentA = generateData();
    const experimentB = generateData();
    const experimentC = generateData();
    
    const calculateTotal = (data: Array<{ day: string; value: number | null }>) => {
      return data.reduce((sum, item) => sum + (item.value || 0), 0);
    };
    
    return {
      current: {
        experimentA,
        experimentB,
        experimentC
      },
      previous: {
        experimentA: Array.from({ length: 3 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        })),
        experimentB: Array.from({ length: 3 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        })),
        experimentC: Array.from({ length: 3 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        }))
      },
      currentTotals: {
        experimentA: calculateTotal(experimentA),
        experimentB: calculateTotal(experimentB),
        experimentC: calculateTotal(experimentC)
      },
      previousTotals: {
        experimentA: 230,
        experimentB: 165,
        experimentC: 290
      }
    };
  }
  
  if (timeRange === '7-day') {
    // Generate 7-day data
    const today = new Date();
    
    const generateData = () => {
      // Calculate how many days we are into the current month
      const currentDay = today.getDate();
      const daysIntoMonth = currentDay - 1; // Days before today this month
      
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        const isFutureDate = isAfter(date, today);
        
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : Math.floor(Math.random() * 100)
        };
      });
    };
    
    const experimentA = generateData();
    const experimentB = generateData();
    const experimentC = generateData();
    
    const calculateTotal = (data: Array<{ day: string; value: number | null }>) => {
      return data.reduce((sum, item) => sum + (item.value || 0), 0);
    };
    
    return {
      current: {
        experimentA,
        experimentB,
        experimentC
      },
      previous: {
        experimentA: Array.from({ length: 7 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        })),
        experimentB: Array.from({ length: 7 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        })),
        experimentC: Array.from({ length: 7 }, () => ({
          day: "day",
          value: Math.floor(Math.random() * 100)
        }))
      },
      currentTotals: {
        experimentA: calculateTotal(experimentA),
        experimentB: calculateTotal(experimentB),
        experimentC: calculateTotal(experimentC)
      },
      previousTotals: {
        experimentA: 460,
        experimentB: 330,
        experimentC: 580
      }
    };
  }
  
  if (timeRange === 'rolling-30-day') {
    // Generate rolling 30-day data with reset on the 1st of each month
    const today = new Date();
    
    const generateResettingData = () => {
      return Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 29 - i);
        const isFutureDate = isAfter(date, today);
        const dayOfMonth = getDate(date);
        
        // Reset to 0 on the 1st of each month
        return {
          day: format(date, 'MMM d'),
          value: isFutureDate ? null : (dayOfMonth === 1 ? 0 : Math.floor(Math.random() * 100))
        };
      });
    };
    
    // Create data with resets for each experiment
    const experimentA = generateResettingData();
    const experimentB = generateResettingData();
    const experimentC = generateResettingData();
    
    // Calculate totals based on this reset data
    const calculateTotal = (data: Array<{ day: string; value: number | null }>) => {
      return data.reduce((sum, item) => sum + (item.value || 0), 0);
    };
    
    return {
      current: {
        experimentA,
        experimentB,
        experimentC
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
        experimentA: calculateTotal(experimentA),
        experimentB: calculateTotal(experimentB),
        experimentC: calculateTotal(experimentC)
      },
      previousTotals: {
        experimentA: 2300,
        experimentB: 1650,
        experimentC: 2900
      }
    };
  }
  
  // For other time ranges, use the original mock data
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
      day: ['rolling-30-day', 'last-12-months', '3-day', '7-day'].includes(timeRange)
        ? dataPoint.day
        : (index + 1).toString(),
      value: totalValue as number // Ensure the value is explicitly typed as number
    };
  });
}
