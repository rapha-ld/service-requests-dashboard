import { useEffect, useState } from "react";
import { ViewToggleSection } from "@/components/charts/ViewToggleSection";
import { TotalChartSection } from "@/components/charts/TotalChartSection";
import { ChartsGridSection } from "@/components/charts/ChartsGridSection";
import { ViewType, ChartType, TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";
import { getEffectiveChartProperties } from "@/utils/chartPropertiesFactory";

interface DashboardChartsProps {
  allEnvironmentsData: Array<{ day: string, value: number }>;
  sortedGroups: Array<any>;
  viewType: ViewType;
  chartType: ChartType;
  maxValue: number;
  grouping: string;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  useViewDetailsButton?: boolean;
  showOnlyTotal?: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  timeRange?: string;
  onViewTypeChange?: (viewType: ViewType) => void;
  disableViewTypeToggle?: boolean;
  customDateRange?: DateRange;
  isHourlyData?: boolean;
  individualMaxValues?: boolean;
}

export const DashboardCharts = ({
  allEnvironmentsData,
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  grouping,
  chartRefs,
  onExportChart,
  useViewDetailsButton = true,
  showOnlyTotal = false,
  unitLabel,
  showThreshold = false,
  threshold,
  timeRange = 'month-to-date',
  onViewTypeChange,
  disableViewTypeToggle = false,
  customDateRange,
  isHourlyData = false,
  individualMaxValues = false
}: DashboardChartsProps) => {
  const [expandedCharts, setExpandedCharts] = useState<string[]>([]);
  
  // Get effective chart properties based on time range and other factors
  const { effectiveViewType, effectiveChartType, displayUnitLabel } = 
    getEffectiveChartProperties(viewType, chartType, timeRange, unitLabel, isHourlyData);
  
  // Always show the total chart
  return (
    <div className="space-y-6">
      {onViewTypeChange && !disableViewTypeToggle && (
        <ViewToggleSection 
          viewType={viewType} 
          onViewTypeChange={onViewTypeChange} 
        />
      )}
      
      <TotalChartSection
        allEnvironmentsData={allEnvironmentsData}
        viewType={effectiveViewType}
        chartType={effectiveChartType}
        chartRef={chartRefs.current['total']}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={displayUnitLabel}
        showThreshold={showThreshold}
        threshold={threshold}
        timeRange={timeRange}
      />
      
      {!showOnlyTotal && (
        <ChartsGridSection
          sortedGroups={sortedGroups}
          viewType={effectiveViewType}
          chartType={effectiveChartType}
          maxValue={maxValue}
          chartRefs={chartRefs}
          onExportChart={onExportChart}
          expandedCharts={expandedCharts}
          onToggleExpand={(id) => {
            setExpandedCharts(prev => 
              prev.includes(id) 
                ? prev.filter(i => i !== id) 
                : [...prev, id]
            );
          }}
          formatValue={(value) => `${value.toLocaleString()} ${displayUnitLabel}`}
          onViewDetails={() => {}}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={displayUnitLabel}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
          individualMaxValues={individualMaxValues}
        />
      )}
    </div>
  );
};
