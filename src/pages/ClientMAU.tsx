
import { useState, useRef, useEffect } from "react";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { MAUDashboardControls } from "@/components/mau/MAUDashboardControls";
import { LoadingState } from "@/components/mau/LoadingState";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useMAUData, TimeRangeType, DateRange } from "@/hooks/useMAUData";
import { 
  transformDataToChartGroups, 
  getLast12MonthsData, 
  calculateMaxValue
} from "@/utils/mauDataTransformers";
import { useUrlParams } from "@/hooks/useUrlParams";

const USER_LIMIT = 25000;

const ClientMAU = () => {
  const urlParams = useUrlParams();
  
  // State management with values from URL parameters
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>(
    urlParams.getViewType() === 'rolling-30d' ? 'cumulative' : urlParams.getViewType() as 'net-new' | 'cumulative'
  );
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>(urlParams.getChartType());
  const [timeRange, setTimeRange] = useState<TimeRangeType>(urlParams.getTimeRange());
  const [selectedProject, setSelectedProject] = useState<string>(urlParams.getSelectedProject());
  const [customDateRange, setCustomDateRange] = useState<DateRange>(urlParams.getCustomDateRange());
  
  const chartRefs = useRef<{ [key: string]: any }>({});

  // Effect to set chart type based on view type
  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
    urlParams.setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  // Handle time range change - allow all view types for all time ranges
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  // Handle view type change - allow changing for all time ranges 
  const handleViewTypeChange = (newViewType: 'net-new' | 'cumulative') => {
    setViewType(newViewType);
    urlParams.setViewType(newViewType);
    
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
    urlParams.setChartType(newViewType === 'net-new' ? 'bar' : 'area');
  };
  
  // Handle chart type change
  const handleChartTypeChange = (newChartType: 'area' | 'bar' | 'line') => {
    setChartType(newChartType);
    urlParams.setChartType(newChartType);
  };
  
  // Handle sort direction change
  const handleSortDirectionChange = () => {
    const newSortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newSortDirection);
    urlParams.setSortDirection(newSortDirection);
  };
  
  // Handle month change
  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setSelectedMonth(newMonth);
    urlParams.setSelectedMonth(newMonth);
  };
  
  // Error handling wrapper for state setters
  const safeSetSelectedProject = (project: string) => {
    try {
      setSelectedProject(project || "all");
      urlParams.setSelectedProject(project || "all");
    } catch (error) {
      console.error("Error setting project:", error);
      setSelectedProject("all");
      urlParams.setSelectedProject("all");
    }
  };

  // Fetch MAU data with the custom hook
  const { mauData, isLoading } = useMAUData(
    selectedMonth, 
    selectedProject, 
    timeRange, 
    timeRange === 'custom' ? customDateRange : undefined
  );

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
          onSortDirectionChange={handleSortDirectionChange}
          onMonthChange={handleMonthChange}
          onTimeRangeChange={handleTimeRangeChange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
          hideModeToggle={true} // Hide in controls, we'll show in chart section
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
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={false} // Always allow toggle
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};

export default ClientMAU;
