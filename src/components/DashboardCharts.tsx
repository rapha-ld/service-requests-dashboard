
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
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  showOnlyTotal?: boolean;
  useViewDetailsButton?: boolean;
  unitLabel?: string;
  showThreshold?: boolean;
  threshold?: number;
  onViewTypeChange?: (value: ViewType) => void;
  disableViewTypeToggle?: boolean;
  timeRange?: string;
  customDateRange?: DateRange;
  isHourlyData?: boolean;
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
  showOnlyTotal = false,
  useViewDetailsButton = true,
  unitLabel = "daily active users",
  showThreshold = false,
  threshold,
  onViewTypeChange,
  disableViewTypeToggle = false,
  timeRange = 'month-to-date',
  customDateRange,
  isHourlyData = false
}: DashboardChartsProps) => {
  const [expandedCharts, setExpandedCharts] = useState<string[]>([]);
  
  // Reset expanded charts when view changes
  useEffect(() => {
    setExpandedCharts([]);
  }, [viewType, chartType, grouping]);

  // Handle chart expand/collapse
  const toggleChartExpansion = (id: string) => {
    setExpandedCharts(prev => 
      prev.includes(id) 
        ? prev.filter(chartId => chartId !== id) 
        : [...prev, id]
    );
  };

  // Format value for tooltips
  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  // Handle "View Details" button click
  const handleViewDetails = (dimensionValue: string) => {
    const baseUrl = location.pathname;
    let viewDetailsUrl = `${baseUrl}/details?dimension=${grouping}&value=${dimensionValue}`;
    
    // Open the details page in a new tab
    window.open(viewDetailsUrl, '_blank');
  };

  // Get effective chart properties
  const { effectiveViewType, effectiveChartType, displayUnitLabel } = getEffectiveChartProperties(
    viewType,
    chartType,
    timeRange,
    unitLabel,
    isHourlyData
  );

  return (
    <div className="space-y-6">
      <ViewToggleSection
        viewType={viewType}
        onViewTypeChange={onViewTypeChange}
        disableViewTypeToggle={disableViewTypeToggle || false}
        timeRange={timeRange}
        isHourlyData={isHourlyData}
        customDateRange={customDateRange}
      />
      
      {/* Total Chart Section */}
      {grouping === 'all' && allEnvironmentsData && (
        <TotalChartSection
          allEnvironmentsData={allEnvironmentsData}
          viewType={effectiveViewType}
          chartType={effectiveChartType}
          chartRef={chartRefs.current.total}
          onExportChart={onExportChart}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={displayUnitLabel}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
        />
      )}
      
      {/* Individual Charts Grid */}
      {!showOnlyTotal && sortedGroups && (
        <ChartsGridSection
          sortedGroups={sortedGroups}
          viewType={effectiveViewType}
          chartType={effectiveChartType}
          maxValue={maxValue}
          chartRefs={chartRefs}
          onExportChart={onExportChart}
          expandedCharts={expandedCharts}
          onToggleExpand={toggleChartExpansion}
          formatValue={formatValue}
          onViewDetails={handleViewDetails}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={displayUnitLabel}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
        />
      )}
    </div>
  );
};
