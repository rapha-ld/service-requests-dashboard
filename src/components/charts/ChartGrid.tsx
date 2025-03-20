
import { SmallMultiple } from "@/components/SmallMultiple";
import { ChartSearch } from "@/components/charts/ChartSearch";
import { LayoutToggle } from "@/components/charts/LayoutToggle";
import { useState } from "react";

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
  onLayoutModeChange: (mode: 'compact' | 'expanded') => void;
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
  individualMaxValues = false,
  onLayoutModeChange
}: ChartGridProps) => {
  const [filteredGroups, setFilteredGroups] = useState(sortedGroups);

  // Handle search filtering
  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredGroups(sortedGroups);
    } else {
      const filtered = sortedGroups.filter(group => 
        group.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  };

  // Calculate the shared maximum value for all charts based on the highest value chart
  const calculateSharedMaxValue = () => {
    if (filteredGroups.length === 0) return maxValue;
    
    if (viewType === 'net-new') {
      // For net-new view, use the provided maxValue or calculate from individual max values
      return maxValue;
    } else {
      // For cumulative view, calculate the maximum cumulative value across all charts
      // For each chart, calculate its max cumulative value
      const chartMaxCumulativeValues = filteredGroups.map(group => {
        let runningSum = 0;
        let maxRunningSum = 0;
        
        group.data.forEach(dataPoint => {
          if (dataPoint.value !== null && dataPoint.value !== undefined) {
            runningSum += dataPoint.value;
            maxRunningSum = Math.max(maxRunningSum, runningSum);
          }
        });
        
        return maxRunningSum;
      });
      
      // Return the highest cumulative value across all charts
      return Math.max(...chartMaxCumulativeValues, 0);
    }
  };
  
  // Get the shared max value for all small charts
  const sharedMaxValue = calculateSharedMaxValue();
  
  // If we're in cumulative view, ensure all charts use the shared max value
  // In net-new view, we can use the provided maxValue
  const effectiveMaxValue = viewType === 'cumulative' ? sharedMaxValue : maxValue;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <ChartSearch onSearch={handleSearch} />
        <LayoutToggle 
          layoutMode={layoutMode}
          setLayoutMode={onLayoutModeChange}
        />
      </div>
      
      <div className={`grid grid-cols-1 gap-4 ${
        layoutMode === 'compact' 
          ? 'md:grid-cols-2 lg:grid-cols-3' 
          : 'md:grid-cols-3 lg:grid-cols-6'
      }`}>
        {filteredGroups.map(group => (
          <SmallMultiple
            key={group.id}
            title={group.title}
            data={group.data}
            color="#2AB4FF"
            unit={unitLabel}
            viewType={viewType}
            maxValue={effectiveMaxValue}
            chartType={chartType}
            chartRef={chartRefs.current[group.title]}
            onExport={onExportChart}
            useViewDetails={useViewDetailsButton}
            showThreshold={showThreshold}
            threshold={threshold}
          />
        ))}
      </div>
      
      {filteredGroups.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No charts match your search criteria.
        </div>
      )}
    </>
  );
};
