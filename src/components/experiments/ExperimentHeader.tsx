
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { SortButton } from "@/components/dashboard/SortButton";

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
  // Add the missing prop to the interface
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
  // Add the prop to the destructuring assignment
  showViewTypeToggle = true
}: ExperimentHeaderProps) => {
  // Determine visibility for conditional components
  const showMonthSelector = timeRange === 'month-to-date';
  // Use the showViewTypeToggle prop in conjunction with the existing logic
  const showViewType = showViewTypeToggle && (timeRange !== 'last-12-months' && timeRange !== 'rolling-30-day');

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
      
      <div className="flex-grow" />
      
      <SortButton 
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
        visible={true}
      />
    </div>
  );
}
