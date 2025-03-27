
import { addDays, format } from 'date-fns';

// Utility to get a random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random data for a given number of days
const generateDailyData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(new Date(), -days + i + 1);
    return {
      day: format(date, 'yyyy-MM-dd'),
      value: getRandomNumber(5, 250)
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
