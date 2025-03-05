// Transform raw data to cumulative values if needed
export const transformData = (
  data: Array<{ day: string; value: number | null }>, 
  viewType: 'net-new' | 'cumulative'
) => {
  if (viewType === 'net-new') return data;
  
  return data.reduce((acc, curr, index) => {
    if (curr.value === null) {
      // For null values (after Feb 22), keep them null in cumulative view too
      return [...acc, {
        day: curr.day,
        value: null
      }];
    }
    
    const previousItem = index > 0 ? acc[index - 1] : null;
    const previousValue = previousItem && previousItem.value !== null ? previousItem.value : 0;
    
    return [...acc, {
      day: curr.day,
      value: previousValue + (curr.value as number)
    }];
  }, [] as Array<{ day: string; value: number | null }>);
};

// Calculate average from non-null values
export const calculateAverage = (data: Array<{ day: string; value: number | null }>) => {
  const nonNullValues = data.filter(item => item.value !== null).map(item => item.value as number);
  return nonNullValues.length > 0 
    ? nonNullValues.reduce((sum, value) => sum + value, 0) / nonNullValues.length 
    : 0;
};
