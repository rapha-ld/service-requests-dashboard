
import { SmallMultiple } from "@/components/SmallMultiple";

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
  const maxValue = viewType === 'cumulative' 
    ? Math.max(...data.reduce((acc, curr, index) => {
        const previousValue = index > 0 ? acc[index - 1] : 0;
        acc[index] = previousValue + curr.value;
        return acc;
      }, [] as number[]))
    : Math.max(...data.map(d => d.value));

  // If threshold is provided and showing threshold is enabled, ensure maxValue is at least the threshold
  const effectiveMaxValue = showThreshold && threshold && threshold > maxValue ? threshold : maxValue;

  return (
    <div className="mb-6">
      <SmallMultiple
        title={showTitle ? title : ""}
        data={data}
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
