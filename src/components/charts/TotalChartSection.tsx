
import { TotalChart } from "@/components/charts/TotalChart";
import { ViewType, ChartType } from "@/types/serviceData";

interface TotalChartSectionProps {
  allEnvironmentsData: Array<{ day: string, value: number }>;
  viewType: ViewType;
  chartType: ChartType;
  chartRef: React.MutableRefObject<any>;
  onExportChart: (title: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  timeRange?: string;
  grouping?: string;
}

export const TotalChartSection = ({
  allEnvironmentsData,
  viewType,
  chartType,
  chartRef,
  onExportChart,
  useViewDetailsButton,
  unitLabel,
  showThreshold = true, // Default to true to always show threshold
  threshold,
  timeRange = 'month-to-date',
  grouping = 'environment'
}: TotalChartSectionProps) => {
  if (!allEnvironmentsData) {
    return null;
  }

  return (
    <div className="mb-6">
      <TotalChart
        title="Total"
        data={allEnvironmentsData}
        viewType={viewType}
        chartType={chartType}
        chartRef={chartRef}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={showThreshold}
        threshold={threshold}
        timeRange={timeRange}
        grouping={grouping}
      />
    </div>
  );
};
