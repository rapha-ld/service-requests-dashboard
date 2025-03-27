
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
  showThreshold = false,
  threshold,
  showTitle = true,
  chartHeight = 192, // Default height
  timeRange = 'month-to-date'
}: TotalChartProps) => {
  const location = useLocation();
  
  // Define which routes should show threshold lines
  // Only show threshold on overview page
  const shouldShowThreshold = location.pathname === "/overview" && showThreshold;
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests",
    "/diagnostics"
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

  // Safety check for data
  const safeData = Array.isArray(data) ? data : [];

  // For cumulative view, ALWAYS accumulate values, even for 3-day views
  // This ensures we show the cumulative value from the beginning of the month
  const shouldAccumulate = effectiveViewType === 'cumulative';
  
  // We want to handle resets only for real monthly resets,
  // which aren't relevant for 3-day views
  const shouldHandleResets = !['3-day'].includes(timeRange || '');
  
  // Transform data based on view type and accumulation settings
  const transformedData = shouldAccumulate 
    ? transformData(safeData, effectiveViewType, shouldHandleResets, isDiagnosticPage) 
    : safeData;
  
  // Calculate max value based on transformed data
  const maxValue = Array.isArray(transformedData) ? 
    Math.max(...transformedData.map(d => (d.value !== null ? d.value : 0)), 0) : 0;

  // If threshold is provided and showing threshold is enabled, ensure maxValue is at least the threshold
  // Only apply this for cumulative view
  const shouldApplyThreshold = shouldShowThreshold && effectiveViewType === 'cumulative';
  const effectiveMaxValue = shouldApplyThreshold && threshold && threshold > maxValue ? threshold : maxValue;

  return (
    <div className="mb-6">
      <SmallMultiple
        title={showTitle ? title : ""}
        data={transformedData}
        color="#2AB4FF"
        unit={unitLabel}
        viewType={effectiveViewType}
        maxValue={effectiveMaxValue}
        chartType={effectiveChartType}
        className="w-full"
        chartRef={chartRef}
        onExport={onExportChart}
        useViewDetails={useViewDetailsButton}
        showThreshold={shouldApplyThreshold}
        threshold={threshold}
        chartHeight={chartHeight}
        timeRange={timeRange}
      />
    </div>
  );
};
