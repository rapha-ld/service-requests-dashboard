
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
  unitLabel
}: ChartGridProps) => {
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
          maxValue={maxValue}
          chartType={chartType}
          chartRef={chartRefs.current[group.title]}
          onExport={onExportChart}
          useViewDetails={useViewDetailsButton}
        />
      ))}
    </div>
  );
};
