
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { GroupingSelector } from "@/components/dashboard/GroupingSelector";
import { SortButton } from "@/components/dashboard/SortButton";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { TimeRangeType } from "@/types/serviceData";

interface DashboardHeaderProps {
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  onGroupingChange: (value: 'all' | 'environment' | 'relayId' | 'userAgent') => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative' | 'rolling-30d') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  timeRange: TimeRangeType;
  onTimeRangeChange: (value: TimeRangeType) => void;
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
  
  // Never show the toggle in the header - it will be shown in the charts section
  const showToggle = false;

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
