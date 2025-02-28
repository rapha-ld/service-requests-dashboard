
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from "@/lib/utils";
import { Button } from './ui/button';
import { useRef } from 'react';
import { CustomTooltip } from './charts/CustomTooltip';
import { formatYAxisTick } from './charts/formatters';
import { transformData, calculateAverage } from './charts/dataTransformers';
import { exportChartAsSVG } from './charts/exportChart';

interface SmallMultipleProps {
  title: string;
  data: Array<{ day: string; value: number | null }>;
  color: string;
  unit: string;
  className?: string;
  viewType: 'net-new' | 'cumulative';
  maxValue: number;
  chartType: 'area' | 'bar';
  showThreshold?: boolean;
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
  showThreshold = false 
}: SmallMultipleProps) => {
  const chartRef = useRef<any>(null);
  
  const average = calculateAverage(data);
  const transformedData = transformData(data, viewType);
  
  const handleExport = () => {
    exportChartAsSVG(chartRef, title);
  };

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const DataComponent = chartType === 'area' ? Area : Bar;

  const handleViewMore = () => {
    // This function would navigate to a detailed view
    // For now just log to console
    console.log(`View more details for ${title}`);
  };

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Button
          variant="link"
          size="sm"
          onClick={handleViewMore}
          className="h-6 p-0 text-xs text-primary underline hover:no-underline"
        >
          View more
        </Button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent ref={chartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#30459B" stopOpacity={1} />
                <stop offset="100%" stopColor="#30459B" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 10 }}
              interval="preserveStart"
              tickLine={false}
              stroke="currentColor"
              className="text-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, maxValue]}
              width={40}
              stroke="currentColor"
              className="text-muted-foreground"
              tickFormatter={formatYAxisTick}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke="#30459B"
                fill="url(#colorGradient)"
                strokeWidth={2}
                connectNulls={true}
              />
            ) : (
              <Bar
                dataKey="value"
                fill="#30459B"
                radius={[1.5, 1.5, 0, 0]}
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
                  fill: 'currentColor',
                  fontSize: 10,
                  position: 'insideTopRight',
                  style: { zIndex: 10 },
                  dy: -15
                }}
              />
            )}
            {showThreshold && (
              <ReferenceLine 
                y={maxValue}
                stroke="#DB2251"
                strokeWidth={1.5}
                label={{
                  value: `Limit: ${maxValue.toLocaleString()}${unit}`,
                  fill: '#DB2251',
                  fontSize: 10,
                  position: 'insideTopRight',
                  style: { zIndex: 10 },
                }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
