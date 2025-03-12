
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UsageProgressBarProps {
  percentUsed: number;
  limit: number;
  isMaxedOut?: boolean;
}

export const UsageProgressBar: React.FC<UsageProgressBarProps> = ({ 
  percentUsed, 
  limit,
  isMaxedOut = false
}) => {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{Math.round(percentUsed)}%</span>
        <span>Limit: {limit.toLocaleString()}</span>
      </div>
      <Progress 
        value={percentUsed} 
        className="h-2" 
        progressColor={isMaxedOut ? "#DB2251" : "#394497"}
      />
    </div>
  );
};
