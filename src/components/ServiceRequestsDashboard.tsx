
import { useState, useRef, useEffect } from "react";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { MAUDashboardControls } from "@/components/mau/MAUDashboardControls";
import { LoadingState } from "@/components/mau/LoadingState";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData } from "@/hooks/useServiceData";
import { TimeRangeType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";

export const ServiceRequestsDashboard = () => {
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

  // Set threshold for Service Connections - same as in Overview tab
  const serviceConnectionsThreshold = 300000;

  // Effect to update chart type based on view type
  useEffect(() => {
    // For net-new view, use bar charts; for cumulative, use area charts
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
    
    // Update chart type based on view type
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

  // Fetch service data with the useServiceData hook
  const { data: serviceData, isLoading } = useServiceData(
    'service-requests',
    'incremental',
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

  // Safety check for data structure
  const safeData = serviceData?.data || [];
  
  // Create simple group structure for DashboardCharts component
  const group = {
    id: 'service-connections',
    title: 'Service Connections',
    value: safeData.reduce((sum: number, item: any) => sum + (item.value || 0), 0),
    data: safeData,
    percentChange: 0
  };
  
  const sortedGroups = [group];
  
  // Maximum value for chart scaling
  const maxValue = Math.max(...safeData.map((item: any) => item.value || 0), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Service Connections" />
        
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
          hideModeToggle={true}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
        />
        
        <DashboardSummary groups={sortedGroups} />
        
        <DashboardCharts
          allEnvironmentsData={safeData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping="all"
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          unitLabel="connections"
          showThreshold={true}
          threshold={serviceConnectionsThreshold}
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={false}
          timeRange={timeRange}
          showOnlyTotal={true}
        />
      </div>
    </div>
  );
};
