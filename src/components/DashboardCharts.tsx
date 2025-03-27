
import { SmallMultiple } from "@/components/SmallMultiple";
import { transformData } from "@/components/charts/dataTransformers";
import { useLocation } from "react-router-dom";
import { TotalChart } from "@/components/charts/TotalChart";

interface TotalChartProps {
  title: string;
  data: Array<{ day: string; value: number }>;
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  chartType: 'area' | 'bar' | 'line';
  chartRef: any;
  onExportChart: (title: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  showTitle?: boolean;
  chartHeight?: number;
  timeRange?: string;
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
  showOnlyTotal,
  unitLabel,
  onViewTypeChange,
  disableViewTypeToggle,
  timeRange,
  showThreshold = false,
  threshold
}) => {
  return (
    <>
      {showOnlyTotal ? (
        <TotalChart
          title="Total"
          data={allEnvironmentsData}
          viewType={viewType}
          chartType={chartType}
          chartRef={chartRefs["all"]}
          onExportChart={() => onExportChart("Total")}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={unitLabel}
          chartHeight={320}
          timeRange={timeRange}
          showThreshold={showThreshold}
          threshold={threshold}
        />
      ) : (
        sortedGroups.map((group) => (
          <TotalChart
            key={group.key}
            title={group.key}
            data={group.data}
            viewType={viewType}
            chartType={chartType}
            chartRef={chartRefs[group.key]}
            onExportChart={() => onExportChart(group.key)}
            useViewDetailsButton={useViewDetailsButton}
            unitLabel={unitLabel}
            chartHeight={192}
            timeRange={timeRange}
            showThreshold={showThreshold}
            threshold={threshold}
          />
        ))
      )}
    </>
  );
};
