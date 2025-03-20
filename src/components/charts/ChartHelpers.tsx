
import { transformData } from './dataTransformers';

// Calculate X-axis interval based on data length
export const calculateXAxisInterval = (dataLength: number): number => {
  if (dataLength <= 7) return 0;
  if (dataLength <= 14) return 1;
  if (dataLength <= 30) return 2;
  return Math.floor(dataLength / 10);
};

// Prepare data for chart display
export const prepareChartData = (
  data: Array<{ day: string; value: number | null }>,
  viewType: 'net-new' | 'cumulative',
  isDiagnosticPage: boolean
) => {
  // Always get the reset points from the transformed data for both view types
  const transformedDataWithResets = transformData(data, 'cumulative', true, false); // Don't skip resets for annotations
  
  // Get reset points from the transformed data
  const resetPoints = transformedDataWithResets
    .filter((item: any) => item.isResetPoint)
    .map((item: any) => item.day);
  
  // Use the appropriate data based on view type
  const transformedData = viewType === 'cumulative' 
    ? transformedDataWithResets 
    : transformData(data, viewType, true, isDiagnosticPage);
    
  return {
    transformedData,
    resetPoints
  };
};

// Calculate effective max value
export const getEffectiveMaxValue = (
  maxValue: number,
  showThreshold: boolean,
  threshold?: number
): number => {
  return showThreshold && threshold && threshold > maxValue 
    ? threshold 
    : maxValue;
};

// Check if a route is diagnostic
export const isDiagnosticRoute = (pathname: string): boolean => {
  return [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(pathname);
};

// Check if a route is plan usage
export const isPlanUsageRoute = (pathname: string): boolean => {
  return [
    "/overview",
    "/client-mau",
    "/experiments",
    "/data-export",
    "/service-connections"
  ].includes(pathname);
};
