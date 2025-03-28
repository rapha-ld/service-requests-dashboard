import { TotalChart } from "@/components/charts/TotalChart";
import { ViewType, ChartType } from "@/types/serviceData";
import { DashboardSummary } from "@/components/DashboardSummary";

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
  totalConnections?: number;
  totalPercentChange?: number;
  groups?: any[];
}

export const TotalChartSection = ({
  allEnvironmentsData,
  viewType,
  chartType,
  chartRef,
  onExportChart,
  useViewDetailsButton,
  unitLabel,
  showThreshold = true,
  threshold,
  timeRange = 'month-to-date',
  grouping = 'environment',
  totalConnections,
  totalPercentChange,
  groups = []
}: TotalChartSectionProps) => {
  if (!allEnvironmentsData) {
    return null;
  }

  const isAllGrouping = grouping === 'all';

  return (
    <div className="mb-6">
      {isAllGrouping && totalConnections !== undefined && (
        <div className="w-full text-left">
          <DashboardSummary 
            groups={groups}
            totalConnections={totalConnections}
            totalPercentChange={totalPercentChange}
            showOnlyTotal={true}
            plainStyle={false}
            timeRange={timeRange}
          />
        </div>
      )}
      
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
        showTitle={!isAllGrouping}
      />
    </div>
  );
};
