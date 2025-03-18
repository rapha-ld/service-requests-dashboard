
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { SortButton } from "@/components/dashboard/SortButton";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";

interface ExperimentHeaderProps {
  viewType: 'net-new' | 'cumulative';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | 'custom') => void;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
  showViewTypeToggle?: boolean;
}

export const ExperimentHeader = ({
  viewType,
  selectedMonth,
  sortDirection,
  timeRange,
  onViewTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange,
  customDateRange,
  onCustomDateRangeChange,
  showViewTypeToggle = true
}: ExperimentHeaderProps) => {
  // Determine visibility for conditional components
  const showMonthSelector = timeRange === 'month-to-date';
  // Show view type toggle for last-12-months or month-to-date when enabled
  const showToggle = showViewTypeToggle && (timeRange === 'last-12-months' || timeRange === 'month-to-date');

  return (
    <div className="flex gap-4 items-center mb-6 flex-wrap">
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
        visible={true}
      />
    </div>
  );
}
