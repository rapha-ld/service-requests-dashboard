
import { useState } from "react";
import { TotalChart } from "@/components/charts/TotalChart";
import { LayoutToggle } from "@/components/charts/LayoutToggle";
import { ChartGrid } from "@/components/charts/ChartGrid";
import { getTotalTitle } from "@/utils/chartUtils";

interface ChartGroup {
  id: string;
  title: string;
  data: Array<{ day: string; value: number }>;
}

interface DashboardChartsProps {
  allEnvironmentsData: Array<{ day: string; value: number }>;
  sortedGroups: ChartGroup[];
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  grouping: 'environment' | 'relayId' | 'userAgent';
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  useViewDetailsButton?: boolean;
  unitLabel?: string;
  showThreshold?: boolean;
  threshold?: number;
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
  unitLabel = "reqs",
  showThreshold = false,
  threshold
}: DashboardChartsProps) => {
  const [layoutMode, setLayoutMode] = useState<'compact' | 'expanded'>('compact');
  const totalTitle = getTotalTitle(grouping);

  return (
    <>
      <TotalChart
        title={totalTitle}
        data={allEnvironmentsData}
        viewType={viewType}
        chartType={chartType}
        chartRef={chartRefs.current[totalTitle]}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={showThreshold}
        threshold={threshold}
      />

      <LayoutToggle 
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
      />

      <ChartGrid
        sortedGroups={sortedGroups}
        layoutMode={layoutMode}
        viewType={viewType}
        chartType={chartType}
        maxValue={maxValue}
        chartRefs={chartRefs}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={false} // Never show threshold on individual charts
        threshold={threshold}
      />
    </>
  );
};
