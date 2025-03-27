
import { PaginatedChartGrid } from "@/components/charts/PaginatedChartGrid";
import { ViewType, ChartType } from "@/types/serviceData";

interface ChartsGridSectionProps {
  sortedGroups: Array<any>;
  viewType: ViewType;
  chartType: ChartType;
  maxValue: number;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  expandedCharts: string[];
  onToggleExpand: (id: string) => void;
  formatValue: (value: number) => string;
  onViewDetails: (dimensionValue: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  timeRange?: string;
  individualMaxValues?: boolean;
}

export const ChartsGridSection = ({
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  chartRefs,
  onExportChart,
  expandedCharts,
  onToggleExpand,
  formatValue,
  onViewDetails,
  useViewDetailsButton,
  unitLabel,
  showThreshold = false,
  threshold,
  timeRange = 'month-to-date',
  individualMaxValues = false,
}: ChartsGridSectionProps) => {
  if (!sortedGroups) {
    return null;
  }

  return (
    <PaginatedChartGrid
      sortedGroups={sortedGroups}
      viewType={viewType}
      chartType={chartType}
      maxValue={maxValue}
      chartRefs={chartRefs}
      onExportChart={onExportChart}
      expandedCharts={expandedCharts}
      onToggleExpand={onToggleExpand}
      formatValue={formatValue}
      onViewDetails={onViewDetails}
      useViewDetailsButton={useViewDetailsButton}
      unitLabel={unitLabel}
      individualMaxValues={individualMaxValues}
      showThreshold={showThreshold}
      threshold={threshold}
      timeRange={timeRange}
      itemsPerPage={60}
    />
  );
};
