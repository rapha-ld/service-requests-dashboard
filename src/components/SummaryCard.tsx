
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  className?: string;
}

export const SummaryCard = ({ title, value, unit, status, className }: SummaryCardProps) => {
  // Mock previous period value - in real app, this would come from props
  const previousValue = value * (1 + (Math.random() * 0.4 - 0.2)); // Random ±20% difference
  const percentChange = ((value - previousValue) / previousValue) * 100;
  
  return (
    <div className={cn(
      "bg-aqi-card p-4 rounded-lg shadow-sm animate-slide-up transition-all duration-200",
      className
    )}>
      <h3 className="text-sm font-medium text-aqi-muted">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[#23252A]">
          {value}
        </span>
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
      </div>
    </div>
  );
};
