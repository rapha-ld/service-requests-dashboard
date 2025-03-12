
// Generate non-cumulative daily data that will add up to the target value
export const generateDailyData = (targetValue: number, growthPattern: 'steady' | 'exponential' | 'stepwise') => {
  const data = [];
  
  // Start date: February 1, 2024
  const startDate = new Date(2024, 1, 1);
  // Today's date
  const today = new Date();
  // End date: Either today or February 22, 2024, whichever is earlier
  const endDate = new Date(Math.min(today.getTime(), new Date(2024, 1, 22).getTime()));
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
        portion = Math.exp(i / daysWithData * 2) / Math.exp(2);
        break;
      case 'stepwise':
        const step = Math.floor(i / (daysWithData / 5));
        portion = 0.1 + (step * 0.25) + (Math.random() * 0.1 - 0.05);
        break;
      case 'steady':
      default:
        portion = 1/daysWithData + (Math.random() * 0.02 - 0.01);
        break;
    }
    
    let dailyValue = Math.round(targetValue * portion);
    dailyValue = Math.min(dailyValue, remainingValue);
    dailyValue = Math.max(1, dailyValue);
    
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
    
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    data.push({
      day: formattedDate,
      value: dailyValues[i]
    });
  }
  
  // Add null values for future dates up to the end of the month
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
