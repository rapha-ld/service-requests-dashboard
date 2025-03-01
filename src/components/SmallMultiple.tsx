
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SmallMultipleProps {
  title: string;
  data: Array<{ day: string; value: number | null }>;
  color?: string;
  unit?: string;
  viewType?: "standard" | "cumulative" | "net-new";
  maxValue?: number;
  className?: string;
  chartType?: 'area' | 'bar';
  showThreshold?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
  unit?: string;
}

const getTitleRoute = (title: string) => {
  const titleMap: { [key: string]: string } = {
    "Client MAU": "/client-mau",
    "Experiment Events": "/experiments",
    "Data Export Events": "/data-export"
  };
  return titleMap[title] || "/";
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-md p-2 shadow-md">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500">
          {payload[0].name}: {payload[0].value} {unit}
        </p>
      </div>
    );
  }

  return null;
};

const formatYAxisTick = (value: number, unit: string) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M' + unit;
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K' + unit;
  } else {
    return value + unit;
  }
};

export const SmallMultiple = ({ 
  title, 
  data, 
  color = "hsl(var(--primary))", 
  unit = "",
  viewType = "standard",
  maxValue = 0,
  className = "",
  chartType = 'area',
  showThreshold = false
}: SmallMultipleProps) => {
  
  const transformedData = React.useMemo(() => {
    if (viewType === "cumulative" || viewType === "net-new") {
      let cumulativeValue = 0;
      return data.map(item => {
        cumulativeValue += (item.value || 0);
        return { ...item, value: cumulativeValue };
      });
    }
    return data;
  }, [data, viewType]);

  const chartRef = React.useRef<any>(null);

  const handleExport = React.useCallback(() => {
    if (chartRef.current) {
      // Basic implementation - consider using a library for more robust export
      const svgData = chartRef.current.container.innerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_chart.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [title]);

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const DataComponent = chartType === 'area' ? Area : Bar;
  
  const detailsRoute = getTitleRoute(title);

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          asChild
        >
          <Link to={detailsRoute}>View details</Link>
        </Button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={transformedData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            className={cn('overflow-visible')}
          >
            <XAxis 
              dataKey="day" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                // Only show first and last date
                const index = transformedData.findIndex(item => item.day === value);
                return index === 0 || index === transformedData.length - 1 
                  ? value 
                  : '';
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => formatYAxisTick(value, unit)}
              width={28}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {chartType === 'area' ? (
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={color}
                fillOpacity={0.1}
                animationDuration={500}
              />
            ) : (
              <Bar 
                dataKey="value" 
                fill={color} 
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            )}
            {showThreshold && maxValue > 0 && (
              <ReferenceLine 
                y={maxValue} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Limit',
                  position: 'insideTopRight',
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 10
                }} 
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
