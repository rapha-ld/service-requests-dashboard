
import { SmallMultiple } from "@/components/SmallMultiple";
import { transformData } from "@/components/charts/dataTransformers";
import { useLocation } from "react-router-dom";

interface TotalChartProps {
  title: string;
  data: Array<{ day: string; value: number }>;
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  chartRef: any;
  onExportChart: (title: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  showTitle?: boolean;
  chartHeight?: number;
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
  chartHeight = 192 // Default height
}: TotalChartProps) => {
  const location = useLocation();
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);

  // Transform data for cumulative view using the same function as other charts
  // Always use handleResets=true to be consistent across all pages
  const transformedData = viewType === 'cumulative' 
    ? transformData(data, viewType, true, isDiagnosticPage) 
    : data;
    
  // Calculate max value based on transformed data
  const maxValue = viewType === 'cumulative' 
    ? Math.max(...transformedData.map(d => d.value !== null ? d.value : 0))
    : Math.max(...data.map(d => d.value));

  // If threshold is provided and showing threshold is enabled, ensure maxValue is at least the threshold
  const effectiveMaxValue = showThreshold && threshold && threshold > maxValue ? threshold : maxValue;

  return (
    <div className="mb-6">
      <SmallMultiple
        title={showTitle ? title : ""}
        data={transformedData}
        color="#2AB4FF"
        unit={unitLabel}
        viewType={viewType}
        maxValue={effectiveMaxValue}
        chartType={chartType}
        className="w-full"
        chartRef={chartRef}
        onExport={onExportChart}
        useViewDetails={useViewDetailsButton}
        showThreshold={showThreshold}
        threshold={threshold}
        chartHeight={chartHeight}
      />
    </div>
  );
};
