
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { GroupingSelector } from "@/components/dashboard/GroupingSelector";
import { SortButton } from "@/components/dashboard/SortButton";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";

interface DashboardHeaderProps {
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  viewType: 'net-new' | 'cumulative';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  onGroupingChange: (value: 'all' | 'environment' | 'relayId' | 'userAgent') => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  timeRange: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom';
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom') => void;
  showGrouping?: boolean;
  showViewTypeToggle?: boolean;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({
  grouping,
  viewType,
  selectedMonth,
  sortDirection,
  onGroupingChange,
  onViewTypeChange,
  onSortDirectionChange,
  onMonthChange,
  timeRange,
  onTimeRangeChange,
  showGrouping = true,
  showViewTypeToggle = true,
  customDateRange,
  onCustomDateRangeChange
}: DashboardHeaderProps) => {
  // Determine visibility for conditional components
  const showMonthSelector = timeRange === 'month-to-date';
  const showSortButton = grouping !== 'all';
  
  // Show view type toggle for last-12-months or when explicitly enabled
  const showToggle = showViewTypeToggle && (timeRange === 'last-12-months' || timeRange === 'month-to-date');

  return (
    <div className="flex gap-4 items-center mb-6 flex-wrap">
      {showGrouping && (
        <GroupingSelector 
          grouping={grouping}
          onGroupingChange={onGroupingChange}
          visible={showGrouping}
        />
      )}
      
      <TimeRangeControls 
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        customDateRange={customDateRange}
        onCustomDateRangeChange={onCustomDateRangeChange}
      />
      
      <MonthSelector 
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        visible={showMonthSelector}
      />
      
      <ViewTypeToggle
        viewType={viewType}
        onViewTypeChange={onViewTypeChange}
        visible={showToggle}
      />
      
      <div className="flex-grow" />
      
      <SortButton 
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
        visible={showSortButton}
      />
    </div>
  );
};
