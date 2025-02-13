
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from "@/lib/utils";

interface SmallMultipleProps {
  title: string;
  data: Array<{ time: string; value: number }>;
  color: string;
  unit: string;
  className?: string;
}

export const SmallMultiple = ({ title, data, color, unit, className }: SmallMultipleProps) => {
  // Calculate average value
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  
  return (
    <div className={cn("bg-aqi-card p-4 rounded-lg shadow-sm animate-fade-in", className)}>
      <h3 className="text-sm font-medium text-aqi-text mb-2">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              unit={unit}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
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
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
