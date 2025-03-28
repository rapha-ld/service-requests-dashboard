
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
  plainStyle?: boolean;
  timeRange?: string;
}

export const DashboardSummary = ({
  groups,
  totalConnections,
  totalPercentChange = 0,
  showOnlyTotal = false,
  plainStyle = false,
  timeRange = 'month-to-date'
}: DashboardSummaryProps) => {
  // Generate dynamic subtitle based on timeframe
  const getTimeframeText = () => {
    switch (timeRange) {
      case '3-day':
        return '3-day';
      case 'rolling-30-day':
        return '30-day';
      case 'month-to-date':
        return 'Monthly';
      case 'last-12-months':
        return '12-month';
      case 'custom':
        return 'custom period';
      default:
        return 'Monthly';
    }
  };

  // Generate dynamic title for the Total card when in "all" dimensions view
  const getTotalCardTitle = () => {
    if (showOnlyTotal) {
      return `${getTimeframeText()} accumulated usage as of today`;
    }
    return "Total";
  };

  return <>
      {!showOnlyTotal && (
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-left">
          Total / Top 5 breakdown of {getTimeframeText()} accumulated usage as of today
        </h3>
      )}
      <div className={`grid grid-cols-1 ${!showOnlyTotal ? 'md:grid-cols-3 lg:grid-cols-6' : ''} gap-4 mb-6`}>
        {/* Total card - always displayed first */}
        <SummaryCard 
          key="total" 
          title={getTotalCardTitle()} 
          value={totalConnections || groups.reduce((sum, group) => sum + group.value, 0)} 
          unit="" 
          status="good" 
          percentChange={totalPercentChange} 
          className={plainStyle ? "bg-transparent p-0 shadow-none" : ""} 
        />
        
        {/* Display top 5 groups if not in showOnlyTotal mode */}
        {!showOnlyTotal && groups.slice(0, 5).map(group => <SummaryCard key={group.id} title={group.title} value={group.value} unit="" status={group.value <= 200 ? 'good' : group.value <= 400 ? 'moderate' : 'poor'} percentChange={group.percentChange} />)}
      </div>
    </>;
};
