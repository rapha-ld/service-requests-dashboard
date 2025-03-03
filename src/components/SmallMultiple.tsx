
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from "@/lib/utils";
import { Button } from './ui/button';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CustomTooltip } from './charts/CustomTooltip';
import { formatYAxisTick } from './charts/formatters';
import { transformData, calculateAverage } from './charts/dataTransformers';
import { exportChartAsSVG, exportChartAsPNG } from './charts/exportChart';
import { Download } from 'lucide-react';

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
  chartRef?: React.MutableRefObject<any>;
  onExport?: (title: string) => void;
  useViewDetails?: boolean;
  hideTitle?: boolean;
}

const getTitleRoute = (title: string): string => {
  const normalizedTitle = title.toLowerCase();
  
  if (normalizedTitle.includes('client') || normalizedTitle.includes('mau')) {
    return '/client-mau';
  } else if (normalizedTitle.includes('experiment')) {
    return '/experiments';
  } else if (normalizedTitle.includes('data export')) {
    return '/data-export';
  } else if (normalizedTitle.includes('server')) {
    return '/server';
  } else if (normalizedTitle.includes('service')) {
    return '/';
  }
  
  return '/overview';
};

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
  chartRef,
  onExport,
  useViewDetails = true,
  hideTitle = false
}: SmallMultipleProps) => {
  const internalChartRef = useRef<any>(null);
  const effectiveChartRef = chartRef || internalChartRef;
  
  const average = calculateAverage(data);
  const transformedData = transformData(data, viewType);
  
  const handleExport = () => {
    if (onExport) {
      onExport(title);
    } else {
      exportChartAsPNG(effectiveChartRef, title);
    }
  };

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const DataComponent = chartType === 'area' ? Area : Bar;
  
  const detailsRoute = getTitleRoute(title);

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      {!hideTitle && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          {useViewDetails && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              asChild
            >
              <Link to={detailsRoute}>View details</Link>
            </Button>
          )}
        </div>
      )}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent ref={effectiveChartRef} data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
