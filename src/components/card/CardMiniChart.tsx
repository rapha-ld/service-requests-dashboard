
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { CustomTooltip } from '../charts/CustomTooltip';
import { formatYAxisTick } from '../charts/formatters';
import { transformData } from '../charts/dataTransformers';

interface CardMiniChartProps {
  chartData: Array<{ day: string; value: number | null }>;
  title: string;
  unit: string;
  limit?: number;
}

export const CardMiniChart: React.FC<CardMiniChartProps> = ({ 
  chartData, 
  title, 
  unit, 
  limit 
}) => {
  // Changed from 'cumulative' to 'net-new' to display incremental charts
  const transformedChartData = chartData ? transformData(chartData, 'net-new') : [];
  
  // Calculate max value based on the data itself
  const maxValue = Math.max(...transformedChartData.map(d => (d.value !== null ? d.value : 0)), 1);

  return (
    <>
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-8 mb-12"></div>
      
      <div className="h-[152px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transformedChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#30459B" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#30459B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              horizontal={true} 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="#888888" 
              strokeOpacity={0.35}  // Updated opacity
            />
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
            <RechartsTooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#30459B"
              fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`}
              strokeWidth={2}
              connectNulls={true}
            />
            {limit && (
              <ReferenceLine 
                y={limit}
                stroke="#DB2251"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: "Limit",
                  fill: '#DB2251',
                  fontSize: 10,
                  position: 'insideTopRight',
                  style: { zIndex: 10 },
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
