
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { ViewType, TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

interface ViewToggleSectionProps {
  viewType: ViewType;
  onViewTypeChange?: (value: ViewType) => void;
  disableViewTypeToggle: boolean;
  timeRange: string;
  isHourlyData?: boolean;
  customDateRange?: DateRange;
}

export const ViewToggleSection = ({
  viewType,
  onViewTypeChange,
  disableViewTypeToggle,
  timeRange,
  isHourlyData,
  customDateRange
}: ViewToggleSectionProps) => {
  // Don't show toggle if disabled or no change handler provided
  if (disableViewTypeToggle || !onViewTypeChange) {
    return null;
  }
  
  // Don't show toggle when using 12M view
  if (timeRange === 'last-12-months') {
    return null;
  }

  // Calculate if custom date range is 3 days or less
  const isCustomDateRangeShort = () => {
    if (timeRange === 'custom' && customDateRange) {
      const { from, to } = customDateRange;
      if (from && to) {
        // Calculate the difference in days
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      }
    }
    return false;
  };

  return (
    <div className="flex justify-between items-center">
      <ViewTypeToggle
        viewType={viewType}
        onViewTypeChange={onViewTypeChange}
        visible={true}
        timeRange={timeRange}
        isCustomDateRangeShort={isCustomDateRangeShort()}
      />
      {isHourlyData && (
        <div className="text-sm text-muted-foreground">
          Showing hourly data
        </div>
      )}
    </div>
  );
};
