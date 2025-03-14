
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { GroupingSelector } from "@/components/dashboard/GroupingSelector";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { SortButton } from "@/components/dashboard/SortButton";

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
  const showViewType = timeRange !== 'last-12-months' && timeRange !== 'rolling-30-day' && showViewTypeToggle;
  const showSortButton = grouping !== 'all';

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
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
      
      {showViewType && (
        <ViewTypeToggle 
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
          visible={true}
        />
      )}
      
      <div className="flex-grow" />
      
      <SortButton 
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
        visible={showSortButton}
      />
    </div>
  );
};
