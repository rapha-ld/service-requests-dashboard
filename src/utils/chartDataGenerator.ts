
// Generate non-cumulative daily data that will add up to the target value
export const generateDailyData = (targetValue: number, growthPattern: 'steady' | 'exponential' | 'stepwise', selectedDate?: Date) => {
  const data = [];
  
  // Calculate dates for the month
  const today = selectedDate || new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  console.log(`Generating daily data for ${currentMonth + 1}/${currentYear} with target: ${targetValue}`);
  
  // Start date: 1st day of selected month
  const startDate = new Date(currentYear, currentMonth, 1);
  // End date: Today's date or end of selected month if in the past
  const now = new Date();
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();
  const endDate = isCurrentMonth 
    ? new Date(currentYear, currentMonth, now.getDate())
    : new Date(currentYear, currentMonth + 1, 0); // Last day of selected month
  
  // Full month end date: Last day of selected month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
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
  const remainingDays = Math.floor((lastDayOfMonth.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  
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
