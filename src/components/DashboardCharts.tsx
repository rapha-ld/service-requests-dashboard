
import { useState, useEffect } from "react";
import { TotalChart } from "@/components/charts/TotalChart";
import { LayoutToggle } from "@/components/charts/LayoutToggle";
import { ChartGrid } from "@/components/charts/ChartGrid";
import { getTotalTitle } from "@/utils/chartUtils";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { TimeRangeMessage } from "@/components/dashboard/TimeRangeMessage";
import { TimeRangeType } from "@/types/mauTypes";

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
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  useViewDetailsButton?: boolean;
  unitLabel?: string;
  showThreshold?: boolean;
  threshold?: number;
  showOnlyTotal?: boolean;
  onViewTypeChange?: (value: 'net-new' | 'cumulative') => void;
  disableViewTypeToggle?: boolean;
  timeRange?: TimeRangeType;
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
  threshold,
  showOnlyTotal = false,
  onViewTypeChange,
  disableViewTypeToggle = false,
  timeRange
}: DashboardChartsProps) => {
  const [layoutMode, setLayoutMode] = useState<'compact' | 'expanded'>('compact');
  const totalTitle = getTotalTitle(grouping);
  
  // Only show the threshold on the Total chart when viewType is cumulative
  const shouldShowThreshold = showThreshold && viewType === 'cumulative';
  
  // Apply doubled height when "All dimensions" is selected
  const chartHeight = grouping === 'all' ? 384 : 192; // 192 * 2 = 384

  return (
    <>
      <div className="flex justify-start items-center mb-4">
        {timeRange === 'rolling-30-day' ? (
          <TimeRangeMessage timeRange={timeRange} />
        ) : onViewTypeChange && !disableViewTypeToggle ? (
          <ViewTypeToggle
            viewType={viewType}
            onViewTypeChange={onViewTypeChange}
            visible={true}
          />
        ) : null}
      </div>
      
      <TotalChart
        title={totalTitle}
        data={allEnvironmentsData}
        viewType={viewType}
        chartType={chartType}
        chartRef={chartRefs.current[totalTitle]}
        onExportChart={onExportChart}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={shouldShowThreshold}
        threshold={threshold}
        showTitle={grouping !== 'all'} // Hide title when "All dimensions" is selected
        chartHeight={chartHeight} // Pass the height value based on grouping
      />

      {!showOnlyTotal && (
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
          onLayoutModeChange={setLayoutMode}
        />
      )}
    </>
  );
};
