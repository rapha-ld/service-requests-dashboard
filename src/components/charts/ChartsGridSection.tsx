
import { ChartGrid } from "@/components/charts/ChartGrid";
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
}: ChartsGridSectionProps) => {
  if (!sortedGroups) {
    return null;
  }

  return (
    <ChartGrid
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
      individualMaxValues={false}
      showThreshold={showThreshold}
      threshold={threshold}
      timeRange={timeRange}
    />
  );
};
