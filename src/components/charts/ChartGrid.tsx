
import { SmallMultiple } from "@/components/SmallMultiple";

interface ChartGroup {
  id: string;
  title: string;
  data: Array<{ day: string; value: number }>;
}

interface ChartGridProps {
  sortedGroups: ChartGroup[];
  layoutMode: 'compact' | 'expanded';
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  individualMaxValues?: boolean;
}

export const ChartGrid = ({
  sortedGroups,
  layoutMode,
  viewType,
  chartType,
  maxValue,
  chartRefs,
  onExportChart,
  useViewDetailsButton,
  unitLabel,
  showThreshold = false,
  threshold,
  individualMaxValues = false
}: ChartGridProps) => {
  // Calculate max value for each chart if individualMaxValues is true
  const getChartMaxValue = (group: ChartGroup) => {
    if (!individualMaxValues) return maxValue;
    
    // Calculate the max value based on viewType
    if (viewType === 'net-new') {
      return Math.max(...group.data.map(d => d.value), 0);
    } else {
      // For cumulative, calculate the sum
      return group.data.reduce((sum, curr) => sum + curr.value, 0);
    }
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${
      layoutMode === 'compact' 
        ? 'md:grid-cols-2 lg:grid-cols-3' 
        : 'md:grid-cols-3 lg:grid-cols-6'
    }`}>
      {sortedGroups.map(group => (
        <SmallMultiple
          key={group.id}
          title={group.title}
          data={group.data}
          color="#2AB4FF"
          unit={unitLabel}
          viewType={viewType}
          maxValue={getChartMaxValue(group)}
          chartType={chartType}
          chartRef={chartRefs.current[group.title]}
          onExport={onExportChart}
          useViewDetails={useViewDetailsButton}
          showThreshold={showThreshold}
          threshold={threshold}
        />
      ))}
    </div>
  );
};
