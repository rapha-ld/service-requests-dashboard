
import { DashboardHeader } from "@/components/DashboardHeader";
import { TimeRangeType } from "@/hooks/useExperimentData";

interface ExperimentHeaderProps {
  viewType: 'net-new' | 'cumulative';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: TimeRangeType;
  onViewTypeChange: (viewType: 'net-new' | 'cumulative') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (month: string) => void;
  onTimeRangeChange: (timeRange: TimeRangeType) => void;
}

export function ExperimentHeader({
  viewType,
  selectedMonth,
  sortDirection,
  timeRange,
  onViewTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange
}: ExperimentHeaderProps) {
  return (
    <DashboardHeader
      grouping="environment" 
      viewType={viewType}
      selectedMonth={selectedMonth}
      sortDirection={sortDirection}
      onGroupingChange={() => {}} // Not used in Experiments
      onViewTypeChange={onViewTypeChange}
      onSortDirectionChange={onSortDirectionChange}
      onMonthChange={onMonthChange}
      timeRange={timeRange}
      onTimeRangeChange={onTimeRangeChange}
      showGrouping={false} // Hide the grouping dropdown
    />
  );
}
