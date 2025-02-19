
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
}

export const SmallMultiple = ({ title, data, color, unit, className, viewType, maxValue }: SmallMultipleProps) => {
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
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">
            {payload[0].value}{unit}
          </p>
          <p className="text-xs text-gray-500">
            {formatTooltipDate(label)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("bg-aqi-card p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <h3 className="text-sm font-medium text-aqi-text mb-2">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 10 }}
              interval="preserveStart"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, maxValue]}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill={color}
              fillOpacity={0.8}
              radius={[1, 1, 0, 0]}
            />
            {viewType === 'net-new' && (
              <ReferenceLine 
                y={average}
                stroke="#545A62"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: `Avg: ${average.toFixed(1)}${unit}`,
                  fill: '#23252A',
                  fontSize: 10,
                  position: 'insideTopRight',
                  style: { zIndex: 10 },
                  dy: -15
                }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
