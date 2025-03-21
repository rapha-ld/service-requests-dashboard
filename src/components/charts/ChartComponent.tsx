
import { useRef } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { formatYAxisTick } from './formatters';
import { transformData, calculateAverage, formatTooltipDate } from './dataTransformers';
import { useLocation } from 'react-router-dom';
import { format, getDaysInMonth } from 'date-fns';

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
  selectedMonth?: number;
  selectedYear?: number;
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
  selectedMonth = new Date().getMonth(),
  selectedYear = new Date().getFullYear()
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
  
  // Only show monthly reset lines in cumulative view, not in rolling-30d
  const shouldShowResetLines = viewType === 'cumulative';

  // For month-to-date view, ensure we're showing the correct date range
  const filterDataToSelectedMonth = () => {
    if (timeRange !== 'month-to-date') return transformedData;
    
    // Get the current date
    const today = new Date();
    
    // If the selected month is the current month and year, only show up to today
    const isCurrentMonthAndYear = 
      selectedMonth === today.getMonth() && 
      selectedYear === today.getFullYear();
    
    if (isCurrentMonthAndYear) {
      // Get today's date formatted as "MMM d" style 
      const todayFormatted = format(today, 'MMM d');
      
      // Find index of today in the data
      const todayIndex = transformedData.findIndex(d => 
        d.day === todayFormatted || 
        d.day.startsWith(todayFormatted + ', ') // For hourly data
      );
      
      // If today is found, slice the data up to today's index
      if (todayIndex >= 0) {
        return transformedData.slice(0, todayIndex + 1);
      }
    }
    
    // For past months, show the entire month
    return transformedData;
  };

  // Filter data for month-to-date view
  const filteredData = filterDataToSelectedMonth();

  // Get X-axis ticks - for month-to-date ensure we have appropriate ticks
  const getXAxisTicks = () => {
    if (!transformedData.length) return [];
    
    if (timeRange === 'month-to-date') {
      // For month-to-date, show:
      // 1. First day of the month
      // 2. Interval days throughout the month
      // 3. Either today (if current month) or last day of month (if past month)
      
      const today = new Date();
      const isCurrentMonthAndYear = 
        selectedMonth === today.getMonth() && 
        selectedYear === today.getFullYear();
      
      // Get first day of selected month
      const firstDay = format(new Date(selectedYear, selectedMonth, 1), 'MMM d');
      
      // Determine last tick based on whether this is current month or past month
      let lastDay;
      if (isCurrentMonthAndYear) {
        // If current month, use today's date
        lastDay = format(today, 'MMM d');
      } else {
        // If past month, use last day of the month
        const lastDayOfMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));
        lastDay = format(new Date(selectedYear, selectedMonth, lastDayOfMonth), 'MMM d');
      }
      
      // Generate middle ticks based on days in the month
      const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));
      const daysToShow = isCurrentMonthAndYear ? today.getDate() : daysInMonth;
      
      // Determine a reasonable interval for middle ticks
      const dayInterval = Math.max(Math.floor(daysToShow / 4), 1); // Show ~4 ticks
      
      const middleTicks = Array.from({ length: Math.floor(daysToShow / dayInterval) - 1 })
        .map((_, i) => format(new Date(selectedYear, selectedMonth, (i + 1) * dayInterval + 1), 'MMM d'));
      
      return [firstDay, ...middleTicks, lastDay].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    }
    
    // For other time ranges, use default interval ticks
    const firstTick = transformedData[0].day;
    const intervalTicks = transformedData
      .slice(1, -1)
      .filter((_, i) => (i + 1) % (xAxisInterval + 1) === 0)
      .map(d => d.day);
    
    const lastTick = transformedData[transformedData.length - 1].day;
    
    return [firstTick, ...intervalTicks, lastTick];
  };

  const xAxisTicks = getXAxisTicks();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComp ref={chartRef} data={filteredData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
  );
};
