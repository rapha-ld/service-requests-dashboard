
import { format, subMonths, subDays, isAfter, parse, getDate, getMonth, subHours } from "date-fns";
import { getTotalValue } from "@/components/charts/dataTransformers";
import { TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

// Base data generator to create consistent historical data
export const generateHistoricalData = (days: number, withHourly = false) => {
  const today = new Date();
  
  // Create a baseline series with natural daily fluctuations but consistent trends
  // This ensures all time windows (3D, 7D, 30D) show the same data, just different periods
  const generateConsistentSeries = (seed = 1) => {
    // Generate 60 days of history to have enough data for all time ranges
    return Array.from({ length: 60 }, (_, i) => {
      const date = subDays(today, 59 - i);
      const isFutureDate = isAfter(date, today);
      
      // Generate data with a consistent pattern over time
      // Base value that grows gradually over time
      const dayOfMonth = getDate(date);
      const monthProgress = Math.min(dayOfMonth / 28, 1); // Scale based on position in month
      
      // Weekly pattern - weekends have less activity
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
      
      // Monthly pattern - slight reset at beginning of month, then growth
      const monthFactor = dayOfMonth === 1 ? 0.8 : 1.0;
      
      // Base value (20-80) with seed modifier for different data series
      const baseValue = 20 + (60 * monthProgress * (seed * 0.5 + 0.5));
      
      // Add some randomness but keep it consistent
      // Use the date as part of the random seed for consistency
      const dateValue = date.getDate() + date.getMonth() * 31;
      const pseudoRandom = Math.sin(dateValue * seed) * 0.5 + 0.5;
      const randomFactor = 0.8 + (pseudoRandom * 0.4);
      
      const value = Math.floor(baseValue * weekendFactor * monthFactor * randomFactor);
      
      return {
        date,
        value: isFutureDate ? null : value
      };
    });
  };
  
  const consistentSeries = generateConsistentSeries();
  
  // For 3-day hourly view, expand each day into hours
  if (withHourly) {
    // Take the last 3 days of data and expand to hourly
    const lastThreeDays = consistentSeries.slice(-3);
    
    // Generate 24 hours for each of the 3 days (72 hours total)
    const hourlyData = [];
    for (let dayIndex = 0; dayIndex < lastThreeDays.length; dayIndex++) {
      const currentDate = lastThreeDays[dayIndex].date;
      const dayValue = lastThreeDays[dayIndex].value;
      
      // Generate hourly values that sum up to approximately the daily value
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(currentDate);
        hourDate.setHours(hour);
        
        // Create hourly pattern - less activity at night, more during day
        let hourFactor = 0.2; // base activity level
        
        // Business hours have more activity
        if (hour >= 9 && hour <= 17) {
          hourFactor = 0.8;
        } 
        // Evening has medium activity
        else if (hour > 17 && hour <= 22) {
          hourFactor = 0.5;
        }
        
        // Add some randomness but keep consistent patterns
        const hourSeed = hour + currentDate.getDate();
        const hourRandom = Math.sin(hourSeed) * 0.3 + 0.85;
        
        // Scale the daily value to hourly with pattern
        const hourlyValue = Math.floor((dayValue / 8) * hourFactor * hourRandom);
        
        hourlyData.push({
          date: hourDate,
          value: hourlyValue
        });
      }
    }
    
    // Return only the requested number of hours
    const hoursToReturn = Math.min(days * 24, hourlyData.length);
    return hourlyData.slice(-hoursToReturn).map(item => ({
      day: format(item.date, 'MMM d, HH:00'),
      value: item.value
    }));
  }
  
  // Return only the requested number of days from the consistent series
  return consistentSeries.slice(-days).map(item => ({
    day: format(item.date, 'MMM d'),
    value: item.value
  }));
};

// Generate data for last 12 months view
export const generateLast12MonthsData = (currentData: Record<string, any[]>) => {
  return Object.fromEntries(
    Object.entries(currentData).map(([key, data]) => [
      key,
      Array.from({ length: 12 }, (_, i) => ({
        day: format(subMonths(new Date(), i), 'MMM'),
        value: Math.floor(Math.random() * 1000)
      })).reverse()
    ])
  );
};

// Generate data for 3-day view with hourly data - using consistent historical data
export const generate3DayData = (currentData: Record<string, any[]>) => {
  return Object.fromEntries(
    Object.entries(currentData).map(([key, index]) => {
      // Use different seed values for different data series to create variation
      const seedValue = parseInt(key.replace(/\D/g, ''), 10) || 1;
      return [key, generateHistoricalData(3, true)];
    })
  );
};

// Generate data for 7-day view - using consistent historical data
export const generate7DayData = (currentData: Record<string, any[]>) => {
  return Object.fromEntries(
    Object.entries(currentData).map(([key, index]) => {
      // Use different seed values for different data series to create variation
      const seedValue = parseInt(key.replace(/\D/g, ''), 10) || 1;
      return [key, generateHistoricalData(7)];
    })
  );
};

// Generate rolling 30-day data - using consistent historical data
export const generateRolling30DayData = (currentData: Record<string, any[]>) => {
  return Object.fromEntries(
    Object.entries(currentData).map(([key, index]) => {
      // Use different seed values for different data series to create variation
      const seedValue = parseInt(key.replace(/\D/g, ''), 10) || 1;
      return [key, generateHistoricalData(30)];
    })
  );
};

// Generate data for custom date range
export const generateCustomDateRangeData = (currentData: Record<string, any[]>, dateRange: DateRange) => {
  // In a real implementation, this would fetch data for the specific date range
  // For now, just return the current data
  return currentData;
};

// Combine data from multiple data sets into a single dataset
export const combineDataSets = (dataSets: Record<string, Array<{ day: string; value: number | null }>>[]) => {
  // Find the first non-empty dataset to use as a template
  const firstDataSet = dataSets.find(ds => Object.keys(ds).length > 0) || dataSets[0];
  if (!firstDataSet) {
    return { total: [] };
  }
  
  const firstKey = Object.keys(firstDataSet)[0];
  if (!firstKey || !firstDataSet[firstKey]) {
    return { total: [] };
  }
  
  const template = firstDataSet[firstKey].map(item => ({ day: item.day, value: 0 }));
  
  dataSets.forEach(dataSet => {
    Object.values(dataSet).forEach(dimensionData => {
      dimensionData.forEach((dayData, index) => {
        if (index < template.length && dayData.value !== null) {
          template[index].value += dayData.value;
        }
      });
    });
  });
  
  return { total: template };
};

// Process the combined data to include totals
export const processCombinedData = (combined: { total: Array<{ day: string; value: number }> }) => {
  return {
    current: combined,
    previous: combined,
    currentTotals: {
      total: getTotalValue(combined.total)
    },
    previousTotals: {
      total: getTotalValue(combined.total)
    }
  };
};
