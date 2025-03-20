
import { useRef } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxisTick } from './formatters';
import { transformData, calculateAverage } from './dataTransformers';
import { useLocation } from 'react-router-dom';

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
  
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections"
  ].includes(location.pathname);
  
  const isPlanUsagePage = [
    "/overview",
    "/client-mau",
    "/experiments",
    "/data-export"
  ].includes(location.pathname);
  
  const average = calculateAverage(data);
  const transformedData = transformData(data, viewType, true, isDiagnosticPage);
  
  const effectiveMaxValue = showThreshold && threshold && threshold > maxValue 
    ? threshold 
    : maxValue;
  
  let ChartComponent;
  let DataComponent;
  
  if (chartType === 'area') {
    ChartComponent = AreaChart;
    DataComponent = Area;
  } else if (chartType === 'bar') {
    ChartComponent = BarChart;
    DataComponent = Bar;
  } else if (chartType === 'line') {
    ChartComponent = LineChart;
    DataComponent = Line;
  }

  const calculateXAxisInterval = () => {
    const dataLength = transformedData.length;
    if (dataLength <= 7) return 0;
    if (dataLength <= 14) return 1;
    if (dataLength <= 30) return 2;
    return Math.floor(dataLength / 10);
  };

  const xAxisInterval = calculateXAxisInterval();

  const resetPoints = transformedData
    .filter((item: any) => item.isResetPoint)
    .map((item: any) => item.day);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#30459B" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#30459B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 10 }}
          interval={xAxisInterval}
          tickLine={false}
          stroke="currentColor"
          className="text-muted-foreground"
          ticks={transformedData.length > 0 ? 
            [transformedData[0].day, 
             ...transformedData.slice(1, -1).filter((_, i) => (i + 1) % (xAxisInterval + 1) === 0).map(d => d.day),
             transformedData[transformedData.length - 1].day] 
            : []}
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={[0, effectiveMaxValue]}
          width={40}
          stroke="currentColor"
          className="text-muted-foreground"
          tickFormatter={formatYAxisTick}
        />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        {chartType === 'area' && (
          <Area
            type="monotone"
            dataKey="value"
            stroke="#30459B"
            fill="url(#colorGradient)"
            strokeWidth={2}
            connectNulls={true}
          />
        )}
        {chartType === 'bar' && (
          <Bar
            dataKey="value"
            fill="#30459B"
            radius={[1.5, 1.5, 0, 0]}
          />
        )}
        {chartType === 'line' && (
          <Line
            type="monotone"
            dataKey="value"
            stroke="#30459B"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
        )}
        {viewType === 'net-new' && (
          <ReferenceLine 
            y={average}
            stroke="currentColor"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            label={{
              value: `Avg: ${average.toFixed(1)}${unit}`,
              fill: 'hsl(var(--secondary-foreground))',
              fontSize: 10,
              position: 'insideTopRight',
              style: { zIndex: 10 },
              dy: -15
            }}
          />
        )}
        {showThreshold && threshold && (
          <ReferenceLine 
            y={threshold}
            stroke="#DB2251"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            label={{
              value: `Limit: ${threshold.toLocaleString()}${unit}`,
              fill: '#DB2251',
              fontSize: 10,
              position: 'insideTopRight',
              style: { zIndex: 10 },
            }}
          />
        )}
        {viewType === 'cumulative' && 
         isPlanUsagePage && 
         resetPoints.map((day, index) => {
           const dataIndex = transformedData.findIndex((d: any) => d.day === day);
           if (dataIndex === -1) return null;
           if (dataIndex === 0) return null;
           return (
             <ReferenceLine 
               key={`reset-${index}`}
               x={day}
               stroke="hsl(var(--muted-foreground))"
               strokeWidth={1.5}
               label={{
                 value: "Monthly usage\nresets here",
                 fill: 'hsl(var(--muted-foreground))',
                 fontSize: 9,
                 position: 'insideTopLeft',
                 offset: 0,
                 style: { zIndex: 10, textAnchor: 'start' },
                 dy: 20
               }}
             />
           );
         })}
      </ChartComponent>
    </ResponsiveContainer>
  );
};
