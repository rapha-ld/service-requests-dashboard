
import { DateRange, TimeRangeType } from "@/types/mauTypes";
import { ProjectSelector } from "@/components/mau/ProjectSelector";
import { TimeRangeControls } from "@/components/dashboard/TimeRangeControls";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { SortButton } from "@/components/dashboard/SortButton";
import { GroupingSelector } from "@/components/dashboard/GroupingSelector";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";

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
  // Determine visibility for conditional components
  const showMonthSelector = timeRange === 'month-to-date';
  // Show view type toggle for last-12-months or month-to-date when not hidden
  const showToggle = !hideModeToggle && (timeRange === 'last-12-months' || timeRange === 'month-to-date');

  return (
    <div className="flex gap-4 items-center mb-6 flex-wrap">
      <ProjectSelector 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

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
};
