
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
  viewType: 'net-new' | 'cumulative';
  maxValue: number;
  chartType: 'area' | 'bar' | 'line';
  showThreshold?: boolean;
  threshold?: number;
  chartRef?: React.MutableRefObject<any>;
  onExport?: (title: string) => void;
  useViewDetails?: boolean;
  chartHeight?: number;
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
  chartHeight = 192
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

  // For smaller charts, ensure there's a minimum scale to make data visible
  let effectiveMaxValue = maxValue;
  if (effectiveMaxValue === 0) {
    effectiveMaxValue = 10; // Minimum scale when there's no data
  }

  // Filter out null values for better visualization
  const validData = data.filter(item => item.value !== null);

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
          showThreshold={showThreshold}
          threshold={threshold}
          chartRef={effectiveChartRef}
        />
      </div>
    </div>
  );
};
