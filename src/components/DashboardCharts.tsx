
import { useEffect, useState } from "react";
import { TotalChart } from "@/components/charts/TotalChart";
import { ChartGrid } from "@/components/charts/ChartGrid";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { SmallMultiple } from "@/components/SmallMultiple";
import { transformData } from "@/components/charts/dataTransformers";
import { Button } from "@/components/ui/button";
import { MousePointer } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface DashboardChartsProps {
  allEnvironmentsData: Array<{ day: string, value: number }>;
  sortedGroups: Array<any>;
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  maxValue: number;
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  showOnlyTotal?: boolean;
  useViewDetailsButton?: boolean;
  unitLabel?: string;
  showThreshold?: boolean;
  threshold?: number;
  onViewTypeChange?: (value: 'net-new' | 'cumulative') => void;
  disableViewTypeToggle?: boolean;
  timeRange?: string;
}

export const DashboardCharts = ({
  allEnvironmentsData,
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  grouping,
  chartRefs,
  onExportChart,
  showOnlyTotal = false,
  useViewDetailsButton = true,
  unitLabel = "daily active users",
  showThreshold = false,
  threshold,
  onViewTypeChange,
  disableViewTypeToggle = false,
  timeRange = 'month-to-date'
}: DashboardChartsProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [expandedCharts, setExpandedCharts] = useState<string[]>([]);
  
  // Define which routes are diagnostic pages
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);

  // Define which routes need consistent scaling for 3D/7D views
  const isClientMAUPage = location.pathname.includes("/client-mau");

  // Reset expanded charts when view changes
  useEffect(() => {
    setExpandedCharts([]);
  }, [viewType, chartType, grouping]);

  // Handle chart expand/collapse
  const toggleChartExpansion = (id: string) => {
    setExpandedCharts(prev => 
      prev.includes(id) 
        ? prev.filter(chartId => chartId !== id) 
        : [...prev, id]
    );
  };

  // Format value for tooltips
  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  // Handle "View Details" button click
  const handleViewDetails = (dimensionValue: string) => {
    const baseUrl = location.pathname;
    let viewDetailsUrl = `${baseUrl}/details?dimension=${grouping}&value=${dimensionValue}`;
    
    // Open the details page in a new tab
    window.open(viewDetailsUrl, '_blank');
  };

  // Render view type toggle based on conditions
  const renderViewTypeToggle = () => {
    // Don't show toggle if disabled or no change handler provided
    if (disableViewTypeToggle || !onViewTypeChange) {
      return null;
    }
    
    // Don't show toggle when using 12M view
    if (timeRange === 'last-12-months') {
      return null;
    }

    return (
      <ViewTypeToggle
        viewType={viewType}
        onViewTypeChange={onViewTypeChange}
        visible={true}
      />
    );
  };

  // Determine if we should use individualMaxValues based on the page and timeRange
  const useIndividualMaxValues = () => {
    // For 3-day and 7-day views, we want to use shared max values for consistency
    if (['3-day', '7-day'].includes(timeRange)) {
      return false;
    }
    
    // For client MAU page, we always want to share the scale
    if (isClientMAUPage) {
      return false;
    }
    
    // For incremental view, use true shared max based on actual data
    if (viewType === 'net-new') {
      return false;
    }
    
    // Default behavior
    return false;
  };

  // Determine the effective view type based on timeRange
  const effectiveViewType = timeRange === 'last-12-months' ? 'net-new' : viewType;
  
  // Determine chart type based on effective view type
  const effectiveChartType = effectiveViewType === 'net-new' ? 'bar' : chartType;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {renderViewTypeToggle()}
      </div>
      
      {/* Total Chart Section */}
      {grouping === 'all' && allEnvironmentsData && (
        <TotalChart
          title="Total"
          data={allEnvironmentsData}
          viewType={effectiveViewType}
          chartType={effectiveChartType}
          chartRef={chartRefs.current.total}
          onExportChart={onExportChart}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={unitLabel}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
        />
      )}
      
      {/* Individual Charts Grid */}
      {!showOnlyTotal && sortedGroups && (
        <ChartGrid
          sortedGroups={sortedGroups}
          viewType={effectiveViewType}
          chartType={effectiveChartType}
          maxValue={maxValue}
          chartRefs={chartRefs}
          onExportChart={onExportChart}
          expandedCharts={expandedCharts}
          onToggleExpand={toggleChartExpansion}
          formatValue={formatValue}
          onViewDetails={handleViewDetails}
          useViewDetailsButton={useViewDetailsButton}
          unitLabel={unitLabel}
          individualMaxValues={useIndividualMaxValues()}
          showThreshold={showThreshold}
          threshold={threshold}
          timeRange={timeRange}
        />
      )}
    </div>
  );
};
