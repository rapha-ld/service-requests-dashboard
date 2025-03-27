
import { format, subDays, isAfter, getDate, subMonths } from "date-fns";
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";
import { ExperimentData } from "./types";

// Generate experiment data based on time range
export function generateExperimentData(
  timeRange: TimeRangeType,
  currentDate: Date,
  customDateRange?: DateRange
): ExperimentData {
  if (timeRange === 'last-12-months') {
    return generateLast12MonthsData();
  } else if (timeRange === '3-day') {
    return generate3DayData();
  } else if (timeRange === '7-day') {
    return generate7DayData();
  } else if (timeRange === 'rolling-30-day') {
    return generateRolling30DayData();
  } else {
    return generateDefaultData();
  }
}

// Generate monthly data for the last 12 months
function generateLast12MonthsData(): ExperimentData {
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

// Generate 3-day data
function generate3DayData(): ExperimentData {
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

// Generate 7-day data
function generate7DayData(): ExperimentData {
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

// Generate rolling 30-day data
function generateRolling30DayData(): ExperimentData {
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

// Generate default data for other time ranges
function generateDefaultData(): ExperimentData {
  return {
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
}
