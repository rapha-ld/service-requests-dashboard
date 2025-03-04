
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
}

export const TotalChart = ({
  title,
  data,
  viewType,
  chartType,
  chartRef,
  onExportChart,
  useViewDetailsButton,
  unitLabel
}: TotalChartProps) => {
  const maxValue = viewType === 'cumulative' 
    ? Math.max(...data.reduce((acc, curr, index) => {
        const previousValue = index > 0 ? acc[index - 1] : 0;
        acc[index] = previousValue + curr.value;
        return acc;
      }, [] as number[]))
    : Math.max(...data.map(d => d.value));

  return (
    <div className="mb-6">
      <SmallMultiple
        title={title}
        data={data}
        color="#2AB4FF"
        unit={unitLabel}
        viewType={viewType}
        maxValue={maxValue}
        chartType={chartType}
        className="w-full"
        chartRef={chartRef}
        onExport={onExportChart}
        useViewDetails={useViewDetailsButton}
      />
    </div>
  );
};
