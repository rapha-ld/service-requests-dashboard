
import { useRef } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxisTick } from './formatters';
import { transformData, calculateAverage, formatTooltipDate } from './dataTransformers';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportChartAsSVG } from './exportChart';

interface ChartComponentProps {
  data: Array<{ day: string; value: number | null }>;
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  unit: string;
  showThreshold?: boolean;
  threshold?: number;
  chartRef: React.MutableRefObject<any>;
  timeRange?: string;
  title?: string; // Added title for SVG export filename
}

export const ChartComponent = ({
  data,
  viewType,
  chartType,
  maxValue,
  unit,
  showThreshold = false,
  threshold,
  chartRef,
  timeRange = 'month-to-date',
  title = 'chart' // Default title
}: ChartComponentProps) => {
  const location = useLocation();
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);
  
  // Define which routes are plan usage pages
  const isPlanUsagePage = [
    "/overview",
    "/client-mau",
    "/experiments",
    "/data-export",
    "/service-connections"
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
    : viewType === 'rolling-30d'
      ? transformData(data, 'rolling-30d', false, false)
      : transformData(data, viewType, true, isDiagnosticPage);
  
  // Only apply threshold to the max value if in cumulative view
  const effectiveMaxValue = showThreshold && threshold && threshold > maxValue && viewType === 'cumulative'
    ? threshold 
    : maxValue;
  
  // Determine which chart component to use based on chartType
  let ChartComp: typeof AreaChart | typeof BarChart | typeof LineChart;
  let DataComp: typeof Area | typeof Bar | typeof Line;
  
  if (chartType === 'area') {
    ChartComp = AreaChart;
    DataComp = Area;
  } else if (chartType === 'bar') {
    ChartComp = BarChart;
    DataComp = Bar;
  } else { // line is the default
    ChartComp = LineChart;
    DataComp = Line;
  }

  const calculateXAxisInterval = () => {
    const dataLength = transformedData.length;
    
    // For 3-day hourly view, show fewer ticks
    if (timeRange === '3-day' && dataLength > 24) {
      return Math.floor(dataLength / 6); // Show ~6 ticks for hourly data
    }
    
    if (dataLength <= 7) return 0;
    if (dataLength <= 14) return 1;
    if (dataLength <= 30) return 2;
    return Math.floor(dataLength / 10);
  };

  const xAxisInterval = calculateXAxisInterval();

  // Format the ticks specifically for 3-day view with hourly data
  const formatXAxisTick = (tick: string) => {
    if (timeRange === '3-day' && tick.includes(':')) {
      // For hourly data, just show the hour
      return tick.split(', ')[1]; // Return just the hour part (e.g., "12:00")
    }
    return tick;
  };
  
  // Show monthly reset lines in both cumulative and net-new views, but not in rolling-30d
  const shouldShowResetLines = viewType !== 'rolling-30d';

  // For month-to-date view, ensure the last tick is today's date
  const getXAxisTicks = () => {
    if (!transformedData.length) return [];
    
    // Set up the initial ticks using current data
    const firstTick = transformedData[0].day;
    const intervalTicks = transformedData
      .slice(1, -1)
      .filter((_, i) => (i + 1) % (xAxisInterval + 1) === 0)
      .map(d => d.day);
    
    // For month-to-date view, always use today's date as the last tick
    let lastTick;
    if (timeRange === 'month-to-date') {
      const today = new Date();
      lastTick = format(today, 'MMM d'); // Format it in the same style as other ticks
    } else {
      lastTick = transformedData[transformedData.length - 1].day;
    }
    
    return [firstTick, ...intervalTicks, lastTick];
  };

  const xAxisTicks = getXAxisTicks();

  // Function to handle SVG download
  const handleDownloadSVG = () => {
    exportChartAsSVG(chartRef, title);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1 right-1 z-10 bg-transparent" 
        onClick={handleDownloadSVG}
        title="Download SVG"
      >
        <FileDown size={16} />
      </Button>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComp ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
            tickFormatter={formatXAxisTick}
            ticks={xAxisTicks}
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
          {showThreshold && threshold && viewType === 'cumulative' && (
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
          {shouldShowResetLines && resetPoints.map((day, index) => {
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
                   value: "Monthly usage reset",
                   fill: 'hsl(var(--muted-foreground))',
                   fontSize: 9,
                   position: 'insideTopLeft',
                   offset: 8,
                   style: { zIndex: 10, textAnchor: 'start' },
                   dy: -4
                 }}
               />
             );
           })}
        </ChartComp>
      </ResponsiveContainer>
    </div>
  );
};
