
import { SmallMultiple } from "@/components/SmallMultiple";
import { transformData } from "@/components/charts/dataTransformers";
import { useLocation } from "react-router-dom";

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
  grouping?: string;
}

export const TotalChart = ({
  title,
  data,
  viewType,
  chartType,
  chartRef,
  onExportChart,
  useViewDetailsButton,
  unitLabel,
  showThreshold = true, // Changed default to true to always show threshold
  threshold,
  showTitle = true,
  chartHeight = 192,
  timeRange = 'month-to-date',
  grouping = 'environment'
}: TotalChartProps) => {
  const location = useLocation();
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);

  // Force net-new view for 12M timeRange
  const effectiveViewType = timeRange === 'last-12-months' ? 'net-new' : viewType;
  
  // Force bar chart for net-new view, line chart for rolling-30d
  let effectiveChartType = chartType;
  if (effectiveViewType === 'net-new') {
    effectiveChartType = 'bar';
  } else if (effectiveViewType === 'rolling-30d') {
    effectiveChartType = 'line';
  }

  // For cumulative view, ALWAYS accumulate values, even for 3-day and 7-day views
  // This ensures we show the cumulative value from the beginning of the month
  const shouldAccumulate = effectiveViewType === 'cumulative';
  
  // We want to handle resets only for real monthly resets,
  // which aren't relevant for 3-day or 7-day views
  const shouldHandleResets = !['3-day', '7-day'].includes(timeRange || '');
  
  // Transform data based on view type and accumulation settings
  const transformedData = shouldAccumulate 
    ? transformData(data, effectiveViewType, shouldHandleResets, isDiagnosticPage) 
    : data;
  
  // Calculate max value based on transformed data only, not including threshold
  const maxValue = Math.max(...transformedData.map(d => (d.value !== null ? d.value : 0)), 1);

  // Double the chart height when grouping is 'all'
  const effectiveChartHeight = grouping === 'all' ? chartHeight * 2 : chartHeight;

  // Always show threshold in total chart, regardless of whether it's a dimension view or all dimensions
  const shouldShowThreshold = threshold !== undefined;

  return (
    <div className="mb-6">
      <SmallMultiple
        title={showTitle ? title : ""}
        data={transformedData}
        color="#2AB4FF"
        unit={unitLabel}
        viewType={effectiveViewType}
        maxValue={maxValue}
        chartType={effectiveChartType}
        className="w-full"
        chartRef={chartRef}
        onExport={onExportChart}
        useViewDetails={useViewDetailsButton}
        showThreshold={shouldShowThreshold}
        threshold={threshold}
        chartHeight={effectiveChartHeight}
        timeRange={timeRange}
      />
    </div>
  );
};
