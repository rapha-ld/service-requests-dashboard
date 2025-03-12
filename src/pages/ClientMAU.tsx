
import { useState, useRef, useEffect } from "react";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { MAUDashboardControls } from "@/components/mau/MAUDashboardControls";
import { LoadingState } from "@/components/mau/LoadingState";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useMAUData, TimeRangeType } from "@/hooks/useMAUData";
import { 
  transformDataToChartGroups, 
  getLast12MonthsData, 
  calculateMaxValue
} from "@/utils/mauDataTransformers";

const ClientMAU = () => {
  // State management
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('bar'); // Default to bar
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const chartRefs = useRef<{ [key: string]: any }>({});

  // Monthly user limit - same as in Overview
  const USER_LIMIT = 25000;
  
  // Effect to reset viewType to 'net-new' when timeRange is 'last-12-months'
  useEffect(() => {
    if (timeRange === 'last-12-months') {
      setViewType('net-new');
    }
  }, [timeRange]);
  
  // Effect to set chart type based on view type
  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
    }
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: 'net-new' | 'cumulative') => {
    setViewType(newViewType);
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
  };
  
  // Handle chart type change
  const handleChartTypeChange = (newChartType: 'area' | 'bar' | 'line') => {
    setChartType(newChartType);
  };
  
  // Error handling wrapper for state setters
  const safeSetSelectedProject = (project: string) => {
    try {
      setSelectedProject(project || "all");
    } catch (error) {
      console.error("Error setting project:", error);
      setSelectedProject("all");
    }
  };

  // Fetch MAU data with the custom hook
  const { mauData, isLoading } = useMAUData(selectedMonth, selectedProject, timeRange);

  // Handle loading state
  if (isLoading) {
    return (
      <LoadingState 
        selectedProject={selectedProject} 
        setSelectedProject={safeSetSelectedProject} 
      />
    );
  }

  // Ensure we have valid data to work with
  const safeData = mauData;
  const safeCurrent = safeData?.current || {};
  const safeCurrentTotals = safeData?.currentTotals || {};
  const safePreviousTotals = safeData?.previousTotals || {};

  // Transform the data into chart groups
  const groups = transformDataToChartGroups(safeCurrent, safeCurrentTotals, safePreviousTotals);
  
  // Sort the groups
  const sortedGroups = [...groups].sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  // Calculate max value for the charts
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Determine if we should show the threshold based on project selection
  const showThreshold = selectedProject === "all";

  // Prepare the data for the top chart (all environments)
  let allEnvironmentsData = getLast12MonthsData(safeCurrent, timeRange);
  
  // For rolling-30-day view, we don't need any additional date formatting
  // since both the top chart and small charts now use the same date format from the data source

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Client MAU" />
        
        <MAUDashboardControls
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          timeRange={timeRange}
          selectedProject={selectedProject}
          setSelectedProject={safeSetSelectedProject}
          onViewTypeChange={handleViewTypeChange}
          onChartTypeChange={handleChartTypeChange}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          onTimeRangeChange={handleTimeRangeChange}
        />
        
        <DashboardSummary groups={sortedGroups} />
        
        <DashboardCharts
          allEnvironmentsData={allEnvironmentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={Math.max(maxValue, USER_LIMIT)}
          grouping="environment"
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          unitLabel="users"
          showThreshold={showThreshold}
          threshold={USER_LIMIT}
        />
      </div>
    </div>
  );
};

export default ClientMAU;
