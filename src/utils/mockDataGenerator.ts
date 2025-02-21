
export const generateMockMonthlyData = (baseValue: number, date: Date) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: `${i + 1}`,
    value: Math.max(0, baseValue + Math.floor(Math.random() * 20 - 10))
  }));
};

export const getMockData = (grouping: 'environment' | 'relayId' | 'userAgent') => {
  switch (grouping) {
    case 'relayId':
      return {
        'Relay-001': generateMockMonthlyData(12, new Date()),
        'Relay-002': generateMockMonthlyData(8, new Date()),
        'Relay-003': generateMockMonthlyData(15, new Date()),
        'Relay-004': generateMockMonthlyData(6, new Date()),
        'Relay-005': generateMockMonthlyData(10, new Date()),
        'Relay-006': generateMockMonthlyData(9, new Date()),
      };
    case 'userAgent':
      return {
        'Chrome': generateMockMonthlyData(20, new Date()),
        'Firefox': generateMockMonthlyData(15, new Date()),
        'Safari': generateMockMonthlyData(10, new Date()),
        'Edge': generateMockMonthlyData(8, new Date()),
        'Mobile': generateMockMonthlyData(12, new Date()),
        'Other': generateMockMonthlyData(5, new Date()),
      };
    default:
      return {
        development: generateMockMonthlyData(15, new Date()),
        staging: generateMockMonthlyData(8, new Date()),
        preProduction: generateMockMonthlyData(5, new Date()),
        production: generateMockMonthlyData(3, new Date()),
        testing: generateMockMonthlyData(10, new Date()),
        qa: generateMockMonthlyData(7, new Date()),
      };
  }
};

