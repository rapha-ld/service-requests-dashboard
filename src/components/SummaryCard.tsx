
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { FormattedCardTitle } from "./card/FormattedCardTitle";
import { PercentChangeIndicator } from "./card/PercentChangeIndicator";
import { UsageProgressBar } from "./card/UsageProgressBar";
import { CardMiniChart } from "./card/CardMiniChart";

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
  const isDataExportEvents = title === "Data Export Events";
  
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className={cn(
      "bg-card p-4 rounded-lg shadow-sm animate-slide-up transition-all duration-200 text-left",
      "dark:bg-secondary dark:border dark:border-border",
      heightClass,
      className
    )}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-muted-foreground">
          <FormattedCardTitle title={title} />
        </h3>
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
          <PercentChangeIndicator percentChange={percentChange} />
        )}
      </div>
      
      {(percentUsed !== undefined && limit !== undefined) && (
        <UsageProgressBar 
          percentUsed={percentUsed} 
          limit={limit} 
          isMaxedOut={isMaxedOut} 
        />
      )}
      
      {chartData && chartData.length > 0 && (
        <CardMiniChart 
          chartData={chartData} 
          title={title} 
          unit={unit} 
          limit={limit} 
        />
      )}
    </div>
  );
};
