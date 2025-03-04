
import { calculatePercentChange } from "./dataTransformers";
import { ChartGroup, EnvironmentData, EnvironmentsMap, MAUDataResult } from "@/hooks/useMAUData";

// Transform the data into chart groups
export const transformDataToChartGroups = (
  safeCurrent: EnvironmentsMap,
  safeCurrentTotals: Record<string, number>,
  safePreviousTotals: Record<string, number>
): ChartGroup[] => {
  return Object.entries(safeCurrent).map(([id, data]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    data: data || [],
    value: safeCurrentTotals[id] || 0,
    percentChange: calculatePercentChange(
      safeCurrentTotals[id] || 0, 
      safePreviousTotals[id] || 0
    )
  }));
};

// Prepare the combined data for all environments
export const getCombinedEnvironmentsData = (safeCurrent: EnvironmentsMap): EnvironmentData => {
  let allEnvironmentsData: EnvironmentData = [];
  
  if (safeCurrent && Object.keys(safeCurrent).length > 0) {
    const firstEnvKey = Object.keys(safeCurrent)[0];
    const firstEnvData = safeCurrent[firstEnvKey];
    
    if (firstEnvData && firstEnvData.length > 0) {
      allEnvironmentsData = firstEnvData.map((_, index) => {
        const day = (index + 1).toString();
          
        const value = Object.values(safeCurrent).reduce((sum, data) => {
          if (!data || !data[index]) return sum;
          return sum + (data[index]?.value || 0);
        }, 0);
        
        return { day, value };
      });
    }
  }
  
  return allEnvironmentsData;
};

// Calculate max value for the charts
export const calculateMaxValue = (
  groups: ChartGroup[],
  viewType: 'net-new' | 'cumulative'
): number => {
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => (env.data || []).map(d => d.value)), 0)
    : Math.max(...groups.map(env => 
        (env.data || []).reduce((sum, item) => sum + item.value, 0)
      ), 0);
};

// Get last 12 months data for a specific formatting type
export const getLast12MonthsData = (safeCurrent: EnvironmentsMap, timeRange: string): EnvironmentData => {
  let allEnvironmentsData: EnvironmentData = [];
  
  if (safeCurrent && Object.keys(safeCurrent).length > 0) {
    const firstEnvKey = Object.keys(safeCurrent)[0];
    const firstEnvData = safeCurrent[firstEnvKey];
    
    if (firstEnvData && firstEnvData.length > 0) {
      allEnvironmentsData = firstEnvData.map((_, index) => {
        const day = timeRange === 'last-12-months' 
          ? (firstEnvData[index]?.day || `Month ${index + 1}`)
          : (index + 1).toString();
          
        const value = Object.values(safeCurrent).reduce((sum, data) => {
          if (!data || !data[index]) return sum;
          return sum + (data[index]?.value || 0);
        }, 0);
        
        return { day, value };
      });
    }
  }
  
  return allEnvironmentsData;
};
