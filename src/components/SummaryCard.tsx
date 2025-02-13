
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  className?: string;
}

export const SummaryCard = ({ title, value, unit, status, className }: SummaryCardProps) => {
  const statusColors = {
    good: 'text-aqi-good',
    moderate: 'text-aqi-moderate',
    poor: 'text-aqi-poor'
  };

  return (
    <div className={cn(
      "bg-aqi-card p-4 rounded-lg shadow-sm animate-slide-up",
      className
    )}>
      <h3 className="text-sm font-medium text-aqi-muted">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className={cn("text-2xl font-semibold", statusColors[status])}>
          {value}
        </span>
        <span className="ml-1 text-sm text-aqi-muted">{unit}</span>
      </div>
    </div>
  );
};
