
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { useRef } from 'react';
import { toast } from './ui/use-toast';

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

export const SmallMultiple = ({ title, data, color, unit, className, viewType, maxValue, chartType, showThreshold = false }: SmallMultipleProps) => {
  const chartRef = useRef<any>(null);
  
  const nonNullValues = data.filter(item => item.value !== null).map(item => item.value as number);
  const average = nonNullValues.length > 0 
    ? nonNullValues.reduce((sum, value) => sum + value, 0) / nonNullValues.length 
    : 0;
  
  const transformedData = viewType === 'cumulative' 
    ? data.reduce((acc, curr, index) => {
        if (curr.value === null) {
          return [...acc, {
            day: curr.day,
            value: null
          }];
        }
        
        const previousItem = index > 0 ? acc[index - 1] : null;
        const previousValue = previousItem && previousItem.value !== null ? previousItem.value : 0;
        
        return [...acc, {
          day: curr.day,
          value: previousValue + (curr.value as number)
        }];
      }, [] as Array<{ day: string; value: number | null }>)
    : data;
  
  const formatTooltipDate = (day: string) => {
    if (day.includes(' ')) return day;
    
    if (!isNaN(parseInt(day))) {
      const date = new Date(new Date().getFullYear(), 0, parseInt(day));
      return format(date, 'MMM dd, yyyy');
    }
    
    return day;
  };

  // Custom formatter for Y-axis labels to prevent truncation
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card dark:bg-card/80 p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">
            {payload[0].value.toLocaleString()}{unit}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTooltipDate(label)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    try {
      if (!chartRef.current) return;

      const svgElement = chartRef.current.container.children[0];
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      svgClone.style.backgroundColor = 'white';
      const svgString = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-chart.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Chart exported",
        description: "The chart has been downloaded as an SVG file.",
      });
    } catch (error) {
      console.error('Error exporting chart:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the chart.",
        variant: "destructive",
      });
    }
  };

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const DataComponent = chartType === 'area' ? Area : Bar;

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="h-8 w-8 p-0"
          title="Export as SVG"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-32">
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
            <Tooltip content={<CustomTooltip />} />
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
