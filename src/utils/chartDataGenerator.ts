// Generate non-cumulative daily data that will add up to the target value
export const generateDailyData = (targetValue: number, growthPattern: 'steady' | 'exponential' | 'stepwise') => {
  const data = [];
  
  // Start date: February 1, 2024
  const startDate = new Date(2024, 1, 1);
  // End date: February 22, 2024 (approx. 22 days)
  const endDate = new Date(2024, 1, 22);
  // Full month end date: February 29, 2024 (for x-axis display only)
  const fullMonthEndDate = new Date(2024, 1, 29);
  
  // Calculate different growth patterns for daily values
  const daysWithData = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generate daily values that will add up to targetValue
  let dailyValues = [];
  let remainingValue = targetValue;
  
  for (let i = 0; i < daysWithData; i++) {
    // Last day gets whatever is left to ensure exact sum
    if (i === daysWithData - 1) {
      dailyValues.push(remainingValue);
      continue;
    }

    let portion;
    switch (growthPattern) {
      case 'exponential':
        // Exponential growth: smaller portions early, larger portions later
        portion = Math.exp(i / daysWithData * 2) / Math.exp(2);
        break;
      case 'stepwise':
        // Stepwise growth: random jumps
        const step = Math.floor(i / (daysWithData / 5));
        portion = 0.1 + (step * 0.25) + (Math.random() * 0.1 - 0.05);
        break;
      case 'steady':
      default:
        // Steady growth with some fluctuation
        portion = 1/daysWithData + (Math.random() * 0.02 - 0.01);
        break;
    }
    
    // Calculate daily value based on portion and ensure we don't exceed remaining
    let dailyValue = Math.round(targetValue * portion);
    dailyValue = Math.min(dailyValue, remainingValue);
    dailyValue = Math.max(1, dailyValue); // Ensure at least 1 per day
    
    dailyValues.push(dailyValue);
    remainingValue -= dailyValue;
  }
  
  // Normalize to ensure we hit exactly the target
  if (dailyValues.reduce((sum, value) => sum + value, 0) !== targetValue) {
    const lastDayIndex = daysWithData - 1;
    dailyValues[lastDayIndex] = targetValue - dailyValues.slice(0, lastDayIndex).reduce((sum, value) => sum + value, 0);
  }
  
  // Convert daily values to the format needed for the chart
  for (let i = 0; i < daysWithData; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Format date as "MMM DD" (e.g., "Feb 01")
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    data.push({
      day: formattedDate,
      value: dailyValues[i]
    });
  }
  
  // Now add empty data points for the rest of the month (after Feb 22)
  const remainingDays = Math.floor((fullMonthEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 1; i <= remainingDays; i++) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() + i);
    
    // Format date as "MMM DD" (e.g., "Feb 23")
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Add data point with null value to show on x-axis but not in the area chart
    data.push({
      day: formattedDate,
      value: null
    });
  }
  
  return data;
};

// Helper function to generate consistent monthly data that stops at Feb 22
export const generateConsistentMonthlyData = (baseValue: number) => {
  // Start date: February 1, 2024
  const startDate = new Date(2024, 1, 1);
  // End date: February 22, 2024
  const endDate = new Date(2024, 1, 22);
  // Full month end date: February 29, 2024 (for x-axis display)
  const fullMonthEndDate = new Date(2024, 1, 29);
  
  const data = [];
  
  // Calculate days with data
  const daysWithData = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generate data points for days with values
  for (let i = 0; i < daysWithData; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Add some randomness but keep it proportional to the base value
    const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
    const value = Math.round(baseValue * randomFactor / daysWithData);
    
    data.push({
      day: formattedDate,
      value: value
    });
  }
  
  // Add null values for the remaining days in February
  const remainingDays = Math.floor((fullMonthEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 1; i <= remainingDays; i++) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() + i);
    
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    data.push({
      day: formattedDate,
      value: null
    });
  }
  
  return data;
};
