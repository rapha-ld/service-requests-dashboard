
import { useRef } from 'react';
import { cn } from "@/lib/utils";
import { Download } from 'lucide-react';
import { ChartTitle } from './charts/ChartTitle';
import { ChartComponent } from './charts/ChartComponent';
import { exportChartAsPNG } from './charts/exportChart';

interface SmallMultipleProps {
  title: string;
  data: Array<{ day: string; value: number | null }>;
  color: string;
  unit: string;
  className?: string;
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  maxValue?: number;
  chartType: 'area' | 'bar' | 'line';
  showThreshold?: boolean;
  threshold?: number;
  chartRef?: React.MutableRefObject<any>;
  onExport?: (title: string) => void;
  useViewDetails?: boolean;
  chartHeight?: number;
  timeRange?: string;
}

export const SmallMultiple = ({ 
  title, 
  data, 
  color, 
  unit, 
  className, 
  viewType, 
  maxValue, 
  chartType, 
  showThreshold = false,
  threshold,
  chartRef,
  onExport,
  useViewDetails = true,
  chartHeight = 192,
  timeRange
}: SmallMultipleProps) => {
  const internalChartRef = useRef<any>(null);
  const effectiveChartRef = chartRef || internalChartRef;
  
  const handleExport = () => {
    if (onExport) {
      onExport(title);
    } else {
      exportChartAsPNG(effectiveChartRef, title);
    }
  };

  // For small charts, calculate a sensible max value if none is provided
  let effectiveMaxValue = maxValue;
  
  if (effectiveMaxValue === undefined) {
    // We need to calculate the max value for this specific chart
    // Filter out null values for max calculation
    const validValues = data.filter(item => item.value !== null).map(item => item.value as number);
    
    if (validValues.length > 0) {
      if (viewType === 'cumulative') {
        // For cumulative view, transform data to get proper accumulated values
        const transformedData = data.reduce((acc, curr, index) => {
          if (curr.value === null) return acc;
          if (index === 0) return [curr.value];
          return [...acc, acc[acc.length - 1] + curr.value];
        }, [] as number[]);
        
        effectiveMaxValue = Math.max(...transformedData, 0);
      } else {
        // For net-new view, just find the highest value
        effectiveMaxValue = Math.max(...validValues, 0);
      }
    } else {
      // Default scale if no data available
      effectiveMaxValue = 10;
    }
  }
  
  // Ensure sensible minimum for better visualization
  if (effectiveMaxValue === 0) {
    effectiveMaxValue = 10; // Minimum scale when there's no data
  }

  // Filter out null values for better visualization
  const validData = data.filter(item => item.value !== null);

  // Only show threshold in cumulative view
  const shouldShowThreshold = showThreshold && viewType === 'cumulative' && threshold !== undefined;

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <ChartTitle title={title} useViewDetails={useViewDetails} />
      <div style={{ height: `${chartHeight}px` }}>
        <ChartComponent
          data={data}  // Keep all data including nulls for proper date ranges
          viewType={viewType}
          chartType={chartType}
          maxValue={effectiveMaxValue}
          unit={unit}
          showThreshold={shouldShowThreshold}
          threshold={threshold}
          chartRef={effectiveChartRef}
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};
