
import { DateRange, TimeRangeType } from "@/types/mauTypes";
import { ProjectSelector } from "@/components/mau/ProjectSelector";
import { DateRangePicker } from "@/components/mau/DateRangePicker";
import { TimeRangeToggle } from "@/components/mau/TimeRangeToggle";
import { ViewTypeToggle } from "@/components/mau/ViewTypeToggle";
import { MonthSelector } from "@/components/mau/MonthSelector";
import { SortDirectionButton } from "@/components/mau/SortDirectionButton";

interface MAUDashboardControlsProps {
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: TimeRangeType;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onChartTypeChange: (value: 'area' | 'bar' | 'line') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: TimeRangeType) => void;
  hideModeToggle?: boolean;
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (dateRange: DateRange) => void;
}

export const MAUDashboardControls = ({
  viewType,
  chartType,
  selectedMonth,
  sortDirection,
  timeRange,
  selectedProject,
  setSelectedProject,
  onViewTypeChange,
  onChartTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange,
  hideModeToggle = false,
  customDateRange,
  onCustomDateRangeChange
}: MAUDashboardControlsProps) => {
  // Handle custom date range selection 
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    if (onCustomDateRangeChange) {
      onCustomDateRangeChange(dateRange);
      // Set time range to custom when date range is changed
      onTimeRangeChange('custom');
    }
  };

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
      <ProjectSelector 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <div className="flex flex-wrap gap-0">
        {/* Date Range Picker - Should always be visible */}
        <DateRangePicker 
          dateRange={customDateRange}
          onDateRangeChange={handleCustomDateRangeChange}
          isSelected={timeRange === 'custom'}
          onTimeRangeTypeChange={() => onTimeRangeChange('custom')}
        />
        
        {/* Time Range Toggle Buttons */}
        <TimeRangeToggle 
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>
      
      {/* Month Selector (only shown for month-to-date view) */}
      {timeRange === 'month-to-date' && (
        <MonthSelector 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
        />
      )}
      
      <div className="flex-grow" />
      
      {/* View Type Toggle (hidden for certain time ranges) */}
      {timeRange !== 'last-12-months' && timeRange !== 'rolling-30-day' && !hideModeToggle && (
        <ViewTypeToggle 
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
        />
      )}
      
      {/* Sort Direction Button */}
      <SortDirectionButton 
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
      />
    </div>
  );
};
