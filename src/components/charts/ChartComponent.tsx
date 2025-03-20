
import { useRef } from 'react';
import { Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { useLocation } from 'react-router-dom';
import { DataComponent, getChartComponent } from './ChartTypes';
import { ChartGradients } from './ChartGradients';
import { ChartAxes } from './ChartAxes';
import { ThresholdLine, AverageLine, ResetPoints } from './ReferenceLines';
import { 
  calculateXAxisInterval, 
  prepareChartData, 
  getEffectiveMaxValue,
  isDiagnosticRoute 
} from './ChartHelpers';

interface ChartComponentProps {
  data: Array<{ day: string; value: number | null }>;
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  unit: string;
  showThreshold?: boolean;
  threshold?: number;
  chartRef: React.MutableRefObject<any>;
}

export const ChartComponent = ({
  data,
  viewType,
  chartType,
  maxValue,
  unit,
  showThreshold = false,
  threshold,
  chartRef
}: ChartComponentProps) => {
  const location = useLocation();
  
  // Determine if we're on a diagnostic page
  const isDiagnosticPage = isDiagnosticRoute(location.pathname);
  
  // Prepare chart data
  const { transformedData, resetPoints } = prepareChartData(data, viewType, isDiagnosticPage);
  
  // Calculate effective maximum value
  const effectiveMaxValue = getEffectiveMaxValue(maxValue, showThreshold, threshold);
  
  // Calculate x-axis tick interval
  const xAxisInterval = calculateXAxisInterval(transformedData.length);
  
  // Get the appropriate chart component based on chart type
  const ChartComp = getChartComponent(chartType);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComp ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <ChartGradients />
        
        <ChartAxes 
          transformedData={transformedData} 
          effectiveMaxValue={effectiveMaxValue}
          xAxisInterval={xAxisInterval}
        />
        
        <Tooltip content={<CustomTooltip unit={unit} />} />
        
        <DataComponent 
          type={chartType}
          dataKey="value"
          stroke="#30459B"
          strokeWidth={2}
          connectNulls={true}
        />
        
        {viewType === 'net-new' && (
          <AverageLine data={data} unit={unit} />
        )}
        
        {showThreshold && threshold && (
          <ThresholdLine threshold={threshold} />
        )}
        
        <ResetPoints 
          resetPoints={resetPoints} 
          transformedData={transformedData} 
        />
      </ChartComp>
    </ResponsiveContainer>
  );
};
