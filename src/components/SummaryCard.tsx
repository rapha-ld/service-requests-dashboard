
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface SummaryCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  className?: string;
  percentChange?: number;
  limit?: number;
  percentUsed?: number;
}

export const SummaryCard = ({ 
  title, 
  value, 
  unit, 
  status, 
  className, 
  percentChange, 
  limit,
  percentUsed 
}: SummaryCardProps) => {
  // Determine if the progress bar should show the danger color (maxed out)
  const isMaxedOut = percentUsed !== undefined && percentUsed >= 95;

  return (
    <div className={cn(
      "bg-card p-4 rounded-lg shadow-sm animate-slide-up transition-all duration-200 text-left",
      "dark:bg-secondary dark:border dark:border-border",
      className
    )}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">
          {value}
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
                  <span>{Math.abs(percentChange).toFixed(1)}%</span>
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
          <div className="flex justify-end text-xs text-muted-foreground mb-1">
            <span>max: {limit}</span>
          </div>
          <Progress 
            value={percentUsed} 
            className="h-2" 
            progressColor={isMaxedOut ? "#DB2251" : "#394497"}
          />
        </div>
      )}
    </div>
  );
};
