
import { SummaryCard } from "@/components/SummaryCard";

interface DashboardSummaryProps {
  groups: Array<{
    id: string;
    title: string;
    value: number;
    percentChange: number;
  }>;
}

export const DashboardSummary = ({ groups }: DashboardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {groups.map(group => (
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
  );
};

