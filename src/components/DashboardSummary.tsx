
import { SummaryCard } from "@/components/SummaryCard";

interface DashboardSummaryProps {
  groups: Array<{
    id: string;
    title: string;
    value: number;
    percentChange: number;
  }>;
  totalConnections?: number;
  totalPercentChange?: number;
  showOnlyTotal?: boolean;
}

export const DashboardSummary = ({ 
  groups, 
  totalConnections, 
  totalPercentChange = 0,
  showOnlyTotal = false
}: DashboardSummaryProps) => {
  return (
    <>
      {!showOnlyTotal && (
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-left">Top 5</h3>
      )}
      <div className={`grid grid-cols-1 ${!showOnlyTotal ? 'md:grid-cols-3 lg:grid-cols-6' : ''} gap-4 mb-6`}>
        {/* Total card - always displayed first */}
        <SummaryCard
          key="total"
          title="Total"
          value={totalConnections || groups.reduce((sum, group) => sum + group.value, 0)}
          unit=""
          status="good"
          percentChange={totalPercentChange}
        />
        
        {/* Display top 5 groups if not in showOnlyTotal mode */}
        {!showOnlyTotal && groups.slice(0, 5).map(group => (
          <SummaryCard
            key={group.id}
            title={group.title}
            value={group.value}
            unit=""
            status={group.value <= 200 ? 'good' : group.value <= 400 ? 'moderate' : 'poor'}
            percentChange={group.percentChange}
          />
        ))}
      </div>
    </>
  );
};
