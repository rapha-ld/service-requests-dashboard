
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface SmallMultipleProps {
  title: string;
  data: Array<{ day: string; value: number }>;
  color: string;
  unit: string;
  className?: string;
  viewType: 'net-new' | 'cumulative';
  maxValue: number;
  chartType: 'area' | 'bar';
}

export const SmallMultiple = ({ title, data, color, unit, className, viewType, maxValue, chartType }: SmallMultipleProps) => {
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  
  const transformedData = viewType === 'cumulative' 
    ? data.reduce((acc, curr, index) => {
        const previousValue = index > 0 ? acc[index - 1].value : 0;
        return [...acc, {
          day: curr.day,
          value: previousValue + curr.value
        }];
      }, [] as Array<{ day: string; value: number }>)
    : data;
  
  const formatTooltipDate = (day: string) => {
    const date = new Date(new Date().getFullYear(), 0, parseInt(day));
    return format(date, 'MMM dd, yyyy');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card dark:bg-card/80 p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">
            {payload[0].value}{unit}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTooltipDate(label)}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const DataComponent = chartType === 'area' ? Area : Bar;

  return (
    <div className={cn("bg-card dark:bg-card/80 p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
              width={25}
              stroke="currentColor"
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke="#30459B"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
            ) : (
              <Bar
                dataKey="value"
                fill="#30459B"
                radius={[4, 4, 0, 0]}
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
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

