
import { ChartsGridSection } from "@/components/charts/ChartsGridSection";
import { TotalChartSection } from "@/components/charts/TotalChartSection";
import { ViewToggleSection } from "@/components/charts/ViewToggleSection";
import { ViewType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

interface DashboardChartsProps {
  allEnvironmentsData: Array<{ day: string, value: number }>;
  sortedGroups: Array<any>;
  viewType: ViewType;
  chartType: ChartType;
  maxValue: number;
  grouping: string;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  useViewDetailsButton: boolean;
  showOnlyTotal?: boolean;
  unitLabel: string;
  onViewTypeChange?: (viewType: ViewType) => void;
  disableViewTypeToggle?: boolean;
  timeRange?: string;
  threshold?: number;
  customDateRange?: DateRange;
  isHourlyData?: boolean;
  showThreshold?: boolean;
  individualMaxValues?: boolean;
  totalConnections?: number;
  totalPercentChange?: number;
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
  useViewDetailsButton,
  showOnlyTotal = false,
  unitLabel,
  onViewTypeChange,
  disableViewTypeToggle = false,
  timeRange = 'month-to-date',
  threshold,
  customDateRange,
  isHourlyData = false,
  showThreshold = true, // Default to true so threshold always shows in Total chart
  individualMaxValues = false,
  totalConnections,
  totalPercentChange,
}: DashboardChartsProps) => {
  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  const onViewDetails = (dimensionValue: string) => {
    // This is a placeholder function for future implementation
    console.log(`View details for ${dimensionValue}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {onViewTypeChange && (
        <ViewToggleSection
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
          disableViewTypeToggle={disableViewTypeToggle}
          timeRange={timeRange || 'month-to-date'}
          isHourlyData={isHourlyData}
          customDateRange={customDateRange}
        />
      )}
      
      <TotalChartSection
        allEnvironmentsData={allEnvironmentsData}
        viewType={viewType}
        chartType={chartType}
        chartRef={chartRefs.current['total']}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={true} // Always show threshold for total chart
        threshold={threshold}
        timeRange={timeRange}
        grouping={grouping}
        totalConnections={totalConnections}
        totalPercentChange={totalPercentChange}
        groups={sortedGroups}
      />

      {!showOnlyTotal && (
        <ChartsGridSection
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          chartRefs={chartRefs}
          onExportChart={onExportChart}
          expandedCharts={[]}
          onToggleExpand={() => {}}
          formatValue={formatValue}
          onViewDetails={onViewDetails}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={unitLabel}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
          individualMaxValues={individualMaxValues}
        />
      )}
    </div>
  );
};
