
import { DateRange } from "@/types/mauTypes";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { SortButton } from "@/components/dashboard/SortButton";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { ViewType } from "@/types/serviceData";

interface ExperimentHeaderProps {
  viewType: ViewType;
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | '3-day' | '7-day' | 'custom';
  onViewTypeChange: (value: ViewType) => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months' | 'rolling-30-day' | '3-day' | '7-day' | 'custom') => void;
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
  // Never show the toggle in the header - it will be shown in the charts section
  const showToggle = false;

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
