
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PercentChangeIndicatorProps {
  percentChange: number;
}

export const PercentChangeIndicator: React.FC<PercentChangeIndicatorProps> = ({ percentChange }) => {
  return (
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
          <p>Change relative to same date last month</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
