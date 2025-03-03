import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CustomTooltip } from './charts/CustomTooltip';
import { formatYAxisTick } from './charts/formatters';
import { transformData } from './charts/dataTransformers';
import { Link } from "react-router-dom";

interface SummaryCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  className?: string;
  percentChange?: number;
  limit?: number;
  percentUsed?: number;
  action?: React.ReactNode;
  chartData?: Array<{ day: string; value: number | null }>;
  detailsLink?: string;
  heightClass?: string;
}

export const SummaryCard = ({ 
  title, 
  value, 
  unit, 
  status, 
  className, 
  percentChange, 
  limit,
  percentUsed,
  action,
  chartData,
  detailsLink,
  heightClass
}: SummaryCardProps) => {
  const isMaxedOut = percentUsed !== undefined && percentUsed >= 95;

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const isDataExportEvents = title === "Data Export Events";

  const transformedChartData = chartData ? transformData(chartData, 'cumulative') : [];

  return (
    <div className={cn(
      "bg-card p-4 rounded-lg shadow-sm animate-slide-up transition-all duration-200 text-left",
      "dark:bg-secondary dark:border dark:border-border",
      heightClass,
      className
    )}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {detailsLink && (
            <Link 
              to={detailsLink}
              className="text-xs text-muted-foreground underline hover:no-underline"
            >
              View details
            </Link>
          )}
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn(
          "text-2xl font-semibold",
          isDataExportEvents && isMaxedOut ? "text-[#ea384c]" : "text-foreground"
        )}>
          {formatNumber(value)}
        </span>
        {percentChange !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center text-sm",
                  percentChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {percentChange >= 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(Math.round(percentChange))}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change from previous period</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {(percentUsed !== undefined && limit !== undefined) && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{Math.round(percentUsed)}%</span>
            <span>Limit: {formatNumber(limit)}</span>
          </div>
          <Progress 
            value={percentUsed} 
            className="h-2" 
            progressColor={isMaxedOut ? "#DB2251" : "#394497"}
          />
        </div>
      )}
      
      {chartData && chartData.length > 0 && (
        <>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-8 mb-10"></div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
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
                  domain={[0, limit || 'auto']}
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
      )}
    </div>
  );
};
