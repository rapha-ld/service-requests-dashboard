
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
  // Calculate the shared maximum value for all charts based on the highest value chart
  const calculateSharedMaxValue = () => {
    if (sortedGroups.length === 0) return maxValue;
    
    // For each chart, determine its maximum value based on the view type
    const chartMaxValues = sortedGroups.map(group => {
      // Filter out null values that might exist after Feb 22
      const validData = group.data.filter(d => d.value !== null);
      
      if (viewType === 'net-new') {
        return Math.max(...validData.map(d => d.value as number), 0);
      } else {
        // For cumulative, calculate the sum of valid values
        return validData.reduce((sum, curr) => sum + (curr.value as number), 0);
      }
    });
    
    // Return the highest value among all charts
    return Math.max(...chartMaxValues, 0);
  };
  
  // Get the shared max value for all small charts
  const sharedMaxValue = calculateSharedMaxValue();

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
          maxValue={individualMaxValues ? undefined : sharedMaxValue}
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
