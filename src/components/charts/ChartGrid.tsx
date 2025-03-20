
import { SmallMultiple } from "@/components/SmallMultiple";
import { ChartSearch } from "@/components/charts/ChartSearch";
import { LayoutToggle } from "@/components/charts/LayoutToggle";
import { useState } from "react";
import { transformData } from "@/components/charts/dataTransformers";

interface ChartGroup {
  id: string;
  title: string;
  data: Array<{ day: string; value: number }>;
}

interface ChartGridProps {
  sortedGroups: ChartGroup[];
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  expandedCharts?: string[];
  onToggleExpand?: (id: string) => void;
  formatValue?: (value: number) => string;
  onViewDetails?: (dimensionValue: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  individualMaxValues?: boolean;
  timeRange?: string;
}

export const ChartGrid = ({
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  chartRefs,
  onExportChart,
  expandedCharts = [],
  onToggleExpand = () => {},
  formatValue = (value) => value.toLocaleString(),
  onViewDetails = () => {},
  useViewDetailsButton,
  unitLabel,
  showThreshold = false,
  threshold,
  individualMaxValues = false,
  timeRange = 'month-to-date'
}: ChartGridProps) => {
  const [layoutMode, setLayoutMode] = useState<'compact' | 'expanded'>('compact');
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

  // Calculate the shared maximum value for all charts
  const calculateSharedMaxValue = () => {
    if (filteredGroups.length === 0) return maxValue;
    
    // For time ranges like 3-day and 7-day, ensure proper scale calculation
    if (['3-day', '7-day'].includes(timeRange)) {
      // For cumulative view, calculate the maximum possible accumulated value
      if (viewType === 'cumulative') {
        // Transform each chart's data to get cumulative values
        const cumulativeMaxValues = filteredGroups.map(group => {
          // Don't handle resets for 3-day and 7-day views
          const transformedData = transformData(group.data, 'cumulative', false);
          return Math.max(...transformedData.map(d => d.value !== null ? d.value : 0), 0);
        });
        
        // Return the highest value among all charts
        return Math.max(...cumulativeMaxValues, 0);
      }
      
      // For net-new view, find the highest individual value
      return Math.max(...filteredGroups.flatMap(group => 
        group.data.map(d => d.value !== null ? d.value : 0)
      ), 0);
    }
    
    // For cumulative view, we need to calculate the maximum possible accumulated value for each chart
    if (viewType === 'cumulative') {
      // Transform each chart's data to get cumulative values
      const cumulativeMaxValues = filteredGroups.map(group => {
        const transformedData = transformData(group.data, 'cumulative', true, false);
        return Math.max(...transformedData.map(d => d.value !== null ? d.value : 0), 0);
      });
      
      // Return the highest value among all charts
      return Math.max(...cumulativeMaxValues, 0);
    }
    
    // For net-new view, find the highest individual value
    return Math.max(...filteredGroups.flatMap(group => 
      group.data.map(d => d.value !== null ? d.value : 0)
    ), 0);
  };
  
  // Get the shared max value for all small charts
  const sharedMaxValue = calculateSharedMaxValue();
  
  // Use the higher of the calculated shared max or the provided maxValue
  const effectiveMaxValue = Math.max(sharedMaxValue, maxValue);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <ChartSearch onSearch={handleSearch} />
        <LayoutToggle 
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
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
            maxValue={individualMaxValues ? undefined : effectiveMaxValue}
            chartType={chartType}
            chartRef={chartRefs.current[group.title]}
            onExport={onExportChart}
            useViewDetails={useViewDetailsButton}
            showThreshold={showThreshold}
            threshold={threshold}
            timeRange={timeRange}
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
