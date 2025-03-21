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
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
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
  onViewTypeChange?: (value: 'net-new' | 'cumulative' | 'rolling-30d') => void;
  disableViewTypeToggle?: boolean;
  timeRange?: string;
  selectedMonth?: number;
  selectedYear?: number;
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
  timeRange = 'month-to-date',
  selectedMonth = new Date().getMonth(),
  selectedYear = new Date().getFullYear()
}: DashboardChartsProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [expandedCharts, setExpandedCharts] = useState<string[]>([]);
  
  const isDiagnosticPage = [
    "/client-connections",
    "/server-mau",
    "/peak-server-connections",
    "/service-requests"
  ].includes(location.pathname);

  const isClientMAUPage = location.pathname.includes("/client-mau");

  useEffect(() => {
    setExpandedCharts([]);
  }, [viewType, chartType, grouping]);

  const toggleChartExpansion = (id: string) => {
    setExpandedCharts(prev => 
      prev.includes(id) 
        ? prev.filter(chartId => chartId !== id) 
        : [...prev, id]
    );
  };

  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  const handleViewDetails = (dimensionValue: string) => {
    const baseUrl = location.pathname;
    let viewDetailsUrl = `${baseUrl}/details?dimension=${grouping}&value=${dimensionValue}`;
    
    window.open(viewDetailsUrl, '_blank');
  };

  const renderViewTypeToggle = () => {
    if (disableViewTypeToggle || !onViewTypeChange) {
      return null;
    }
    
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

  const useIndividualMaxValues = () => {
    if (['3-day', '7-day'].includes(timeRange)) {
      return false;
    }
    
    if (isClientMAUPage) {
      return false;
    }
    
    if (viewType === 'net-new') {
      return false;
    }
    
    return false;
  };

  const effectiveViewType = timeRange === 'last-12-months' ? 'net-new' : viewType;
  
  let effectiveChartType = chartType;
  if (effectiveViewType === 'net-new') {
    effectiveChartType = 'bar';
  } else if (effectiveViewType === 'rolling-30d') {
    effectiveChartType = 'line';
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {renderViewTypeToggle()}
      </div>
      
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
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
      
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
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};
