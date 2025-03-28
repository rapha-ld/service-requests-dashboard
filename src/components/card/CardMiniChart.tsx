
import React from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
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
  
  // Check if we're on a diagnostics page or overview/plan usage page
  const isDiagnosticsPage = location.pathname === '/diagnostics-overview' || 
                           location.pathname === '/client-connections' || 
                           location.pathname === '/server-mau' || 
                           location.pathname === '/peak-server-connections';
  
  // Check if we're on the plan usage overview page
  const isPlanUsagePage = location.pathname === '/overview' || 
                          location.pathname === '/client-mau' || 
                          location.pathname === '/experiments' || 
                          location.pathname === '/data-export';
  
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
          {isPlanUsagePage ? (
            <AreaChart data={transformedChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30459B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#30459B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="#30459B"
                fillOpacity={1}
                fill="url(#colorValue)"
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
          ) : (
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
              {limit && isDiagnosticsPage === false && (
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
          )}
        </ResponsiveContainer>
      </div>
    </>
  );
};
