
import { ViewType, ChartType, TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

interface ChartProperties {
  effectiveViewType: ViewType;
  effectiveChartType: ChartType;
  displayUnitLabel: string;
}

export const getEffectiveChartProperties = (
  viewType: ViewType,
  chartType: ChartType,
  timeRange: string,
  unitLabel: string,
  isHourlyData?: boolean
): ChartProperties => {
  // Determine the effective view type based on timeRange
  const effectiveViewType = timeRange === 'last-12-months' ? 'net-new' : viewType;
  
  // Determine chart type based on effective view type
  let effectiveChartType = chartType;
  if (effectiveViewType === 'net-new') {
    effectiveChartType = 'bar';
  } else if (effectiveViewType === 'rolling-30d') {
    effectiveChartType = 'line';
  }

  // Use special unit label for hourly data
  const displayUnitLabel = isHourlyData ? `hourly ${unitLabel}` : unitLabel;

  return {
    effectiveViewType,
    effectiveChartType,
    displayUnitLabel
  };
};

export const isCustomDateRangeShort = (
  timeRange: TimeRangeType,
  customDateRange?: DateRange
): boolean => {
  if (timeRange === 'custom' && customDateRange) {
    const { from, to } = customDateRange;
    if (from && to) {
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    }
  }
  return false;
};
