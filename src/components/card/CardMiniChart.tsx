
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { CustomTooltip } from '../charts/CustomTooltip';
import { formatYAxisTick } from '../charts/formatters';
import { transformData } from '../charts/dataTransformers';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  // Check if we're on a diagnostics page or overview page
  const isDiagnosticsPage = location.pathname === '/diagnostics-overview' || 
                           location.pathname === '/client-connections' || 
                           location.pathname === '/server-mau' || 
                           location.pathname === '/peak-server-connections';
  
  // Use 'net-new' for diagnostics pages, 'cumulative' for plan usage/overview pages
  const dataTransformType = isDiagnosticsPage ? 'net-new' : 'cumulative';
  
  // Transform data based on the page context
  const transformedChartData = chartData ? transformData(chartData, dataTransformType) : [];
  
  // Calculate max value based on the data itself
  const maxValue = Math.max(...transformedChartData.map(d => (d.value !== null ? d.value : 0)), 1);

  return (
    <>
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-8 mb-12"></div>
      
      <div className="h-[152px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid 
              horizontal={true} 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="#888888" 
              strokeOpacity={0.35}
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
            <Bar
              dataKey="value"
              fill="#30459B"
              radius={[1.5, 1.5, 0, 0]}
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
