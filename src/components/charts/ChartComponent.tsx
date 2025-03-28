import { useRef } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, CartesianGrid } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxisTick } from './formatters';
import { transformData, calculateAverage, formatTooltipDate } from './dataTransformers';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

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
  timeRange = 'month-to-date'
}: ChartComponentProps) => {
  const location = useLocation();
  
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);
  
  const isPlanUsagePage = [
    "/overview",
    "/client-mau",
    "/experiments",
    "/data-export",
    "/service-connections"
  ].includes(location.pathname);
  
  const average = calculateAverage(data);
  
  const transformedDataWithResets = transformData(data, 'cumulative', true, false);
  
  const resetPoints = transformedDataWithResets
    .filter((item: any) => item.isResetPoint)
    .map((item: any) => item.day);
  
  const transformedData = viewType === 'cumulative' 
    ? transformedDataWithResets 
    : viewType === 'rolling-30d'
      ? transformData(data, 'rolling-30d', false, false)
      : transformData(data, viewType, true, isDiagnosticPage);
  
  const effectiveMaxValue = maxValue;
  
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
    
    if (timeRange === '3-day' && dataLength > 24) {
      return Math.floor(dataLength / 6);
    }
    
    if (dataLength <= 7) return 0;
    if (dataLength <= 14) return 1;
    if (dataLength <= 30) return 2;
    return Math.floor(dataLength / 10);
  };

  const xAxisInterval = calculateXAxisInterval();

  const formatXAxisTick = (tick: string) => {
    if (timeRange === '3-day' && tick.includes(':')) {
      return tick.split(', ')[1];
    }
    
    if (/^[A-Za-z]{3}\s\d{1,2}$/.test(tick)) {
      return tick;
    }
    
    if (tick.includes('-')) {
      try {
        const date = new Date(tick);
        return format(date, 'MMM d');
      } catch (e) {
        return tick;
      }
    }
    
    return tick;
  };
  
  const shouldShowResetLines = viewType !== 'rolling-30d' && 
    !['/server-mau', '/peak-server-connections'].includes(location.pathname);

  const getXAxisTicks = () => {
    if (!transformedData.length) return [];
    
    const firstTick = transformedData[0].day;
    const intervalTicks = transformedData
      .slice(1, -1)
      .filter((_, i) => (i + 1) % (xAxisInterval + 1) === 0)
      .map(d => d.day);
    
    let lastTick;
    if (timeRange === 'month-to-date') {
      const today = new Date();
      lastTick = format(today, 'MMM d');
    } else {
      lastTick = transformedData[transformedData.length - 1].day;
    }
    
    return [firstTick, ...intervalTicks, lastTick];
  };

  const xAxisTicks = getXAxisTicks();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComp ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#30459B" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#30459B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          horizontal={true} 
          vertical={false} 
          strokeDasharray="3 3" 
          stroke="#888888" 
          strokeOpacity={0.35} 
        />
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
              fill: 'hsl(var(--muted-foreground))',
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
  );
};
