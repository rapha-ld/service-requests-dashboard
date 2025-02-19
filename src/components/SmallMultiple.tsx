
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
  // Calculate average value for net-new view
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  
  // Transform data for cumulative view
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

  return (
    <div className={cn("bg-aqi-card p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <h3 className="text-sm font-medium text-aqi-text mb-2">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
              unit={unit}
              domain={[0, maxValue]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}`,
                formatTooltipDate(props.payload.day)
              ]}
            />
            {viewType === 'net-new' && (
              <ReferenceLine 
                y={average}
                stroke={color}
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: `Avg: ${average.toFixed(1)}${unit}`,
                  fill: color,
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
            )}
            <Bar
              dataKey="value"
              fill={color}
              fillOpacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
