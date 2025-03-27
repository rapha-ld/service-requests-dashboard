
import { addDays, format, subMonths, setDate } from 'date-fns';

// Utility to get a random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random data for a given number of days
const generateDailyData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(new Date(), -days + i + 1);
    return {
      day: format(date, 'MMM d'), // Updated format to "Mar 7" style
      value: getRandomNumber(5, 250)
    };
  });
};

// Generate monthly data based on a base value and reference date
export const generateMockMonthlyData = (baseValue: number, referenceDate: Date = new Date()) => {
  // Generate 30 days of data for the month
  return Array.from({ length: 30 }, (_, i) => {
    const date = addDays(setDate(referenceDate, 1), i);
    // Create some variability day to day
    const dailyVariation = getRandomNumber(-baseValue * 0.1, baseValue * 0.1);
    // Ensure we don't go below 0
    const value = Math.max(0, Math.round(baseValue / 30 + dailyVariation));
    
    return {
      day: format(date, 'MMM d'),
      value: value
    };
  });
};

// Mock data generator
export const getMockData = (grouping: 'environment' | 'relayId' | 'userAgent') => {
  const environments = ['production', 'staging', 'development', 'test', 'qa'];
  const userAgents = [
    'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 
    'Chrome Mobile', 'Safari Mobile', 'Firefox Mobile', 'Samsung Browser', 'UC Browser',
    'IE', 'Brave', 'Chrome iOS', 'Firefox iOS', 'Edge iOS'
  ];
  
  // Generate more Relay IDs for pagination demo
  const generateRelayIds = () => {
    // Generate 155 relay IDs in total (original + 150 more)
    const relayIdBase = [
      'relay_west_1', 'relay_east_1', 'relay_central_1', 'relay_eu_1', 'relay_asia_1'
    ];
    
    const moreRelayIds = Array.from({ length: 150 }, (_, i) => `relay_${i + 6}`);
    return [...relayIdBase, ...moreRelayIds];
  };
  
  const itemsMap = {
    environment: environments,
    relayId: generateRelayIds(),
    userAgent: userAgents
  };

  const items = itemsMap[grouping];
  const result: Record<string, Array<{ day: string; value: number }>> = {};

  items.forEach(item => {
    result[item] = generateDailyData(30);
  });

  return result;
};
