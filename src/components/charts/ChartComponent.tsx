
import { useRef } from 'react';
import { Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { transformData, calculateAverage } from './dataTransformers';
import { useLocation } from 'react-router-dom';
import { ChartGradients } from './ChartGradients';
import { ChartAxes } from './ChartAxes';
import { ReferenceLines } from './ReferenceLines';
import { calculateXAxisInterval } from './ChartHelpers';
import { renderChartComponent, ChartComponentType } from './ChartTypes';

interface ChartComponentProps {
  data: Array<{ day: string; value: number | null }>;
  viewType: 'net-new' | 'cumulative';
  chartType: ChartComponentType;
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
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);
  
  const average = calculateAverage(data);
  
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
  
  const effectiveMaxValue = showThreshold && threshold && threshold > maxValue 
    ? threshold 
    : maxValue;
  
  const { ChartComponent: Chart, DataComponent, fillProps } = renderChartComponent(chartType);
  
  const xAxisInterval = calculateXAxisInterval(transformedData.length);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <ChartGradients />
        
        <ChartAxes 
          transformedData={transformedData}
          effectiveMaxValue={effectiveMaxValue}
          xAxisInterval={xAxisInterval}
        />
        
        <Tooltip content={<CustomTooltip unit={unit} />} />
        
        <DataComponent
          type="monotone"
          dataKey="value"
          {...fillProps}
        />
        
        <ReferenceLines
          viewType={viewType}
          average={average}
          unit={unit}
          showThreshold={showThreshold}
          threshold={threshold}
          resetPoints={resetPoints}
        />
      </Chart>
    </ResponsiveContainer>
  );
};
