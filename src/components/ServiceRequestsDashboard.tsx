
import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData, GroupingType, TimeRangeType, ViewType, ChartType } from "@/hooks/useServiceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { DiagnosticData, ServiceData } from "@/types/serviceData";

export const ServiceRequestsDashboard = () => {
  const urlParams = useUrlParams();
  
  // State hooks with values from URL parameters
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<ViewType>(urlParams.getViewType());
  const [chartType, setChartType] = useState<ChartType>(urlParams.getChartType());
  const [grouping, setGrouping] = useState<GroupingType>(urlParams.getGrouping());
  const [timeRange, setTimeRange] = useState<TimeRangeType>(urlParams.getTimeRange());
  const [customDateRange, setCustomDateRange] = useState<DateRange>(urlParams.getCustomDateRange());
  
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  // Effect to update chart type based on view type
  useEffect(() => {
    // For net-new view, use bar charts; for cumulative, use area charts; for rolling-30d, use line charts
    if (viewType === 'net-new') {
      setChartType('bar');
      urlParams.setChartType('bar');
    } else if (viewType === 'rolling-30d') {
      setChartType('line');
      urlParams.setChartType('line');
    } else {
      setChartType('area');
      urlParams.setChartType('area');
    }
  }, [viewType]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
    
    // For 3-day view, default to net-new view for hourly bars
    if (newTimeRange === '3-day') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
    
    // Force net-new view when 12M is selected
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
    // Only allow changing if not in 12M view
    if (timeRange !== 'last-12-months') {
      setViewType(newViewType);
      urlParams.setViewType(newViewType);
      // Update chart type based on view type
      if (newViewType === 'net-new') {
        setChartType('bar');
        urlParams.setChartType('bar');
      } else if (newViewType === 'rolling-30d') {
        setChartType('line');
        urlParams.setChartType('line');
      } else {
        setChartType('area');
        urlParams.setChartType('area');
      }
    }
  };
  
  // Handle grouping change
  const handleGroupingChange = (newGrouping: GroupingType) => {
    setGrouping(newGrouping);
    urlParams.setGrouping(newGrouping);
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
  
  // Fetch data using custom hook
  const { data: serviceDataResponse } = useServiceData(
    "service-requests", 
    viewType, 
    timeRange,
    timeRange === 'custom' ? customDateRange : undefined
  );

  if (!serviceDataResponse) return null;
  
  // Check if the response is diagnostic data (has 'data' property) or service data (has 'current' property)
  const isDiagnosticData = 'data' in serviceDataResponse;
  
  // Extract data based on response type
  let serviceData;
  let threshold;
  
  if (isDiagnosticData) {
    // It's diagnostic data
    const diagnosticData = serviceDataResponse as DiagnosticData;
    serviceData = diagnosticData.data;
    threshold = diagnosticData.threshold;
  } else {
    // It's regular service data
    serviceData = serviceDataResponse as ServiceData;
    threshold = undefined;
  }
  
  // Create a simple data structure for processing if we have direct array of data
  const formattedData = Array.isArray(serviceData) ? {
    current: { total: serviceData },
    previous: { total: [] },
    currentTotals: { total: 0 },
    previousTotals: { total: 0 }
  } : serviceData;
  
  // Process data for display
  const { sortedGroups } = processServiceData(formattedData, sortDirection);
  
  // Calculate maxValue
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Get data for all environments chart
  const allEnvironmentsData = Array.isArray(serviceData) ? serviceData : 
    getAllEnvironmentsData(grouping, formattedData, timeRange, sortedGroups);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Service Connections</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={handleGroupingChange}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={handleSortDirectionChange}
          onMonthChange={handleMonthChange}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showViewTypeToggle={false} // Remove toggle from header
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
        />
        
        {grouping !== 'all' && <DashboardSummary groups={sortedGroups} />}
        
        <DashboardCharts
          allEnvironmentsData={allEnvironmentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping={grouping}
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          showOnlyTotal={grouping === 'all'}
          unitLabel="connections"
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={timeRange === 'last-12-months'} // Disable toggle for 12M view
          timeRange={timeRange}
          showThreshold={viewType === 'cumulative'}
          threshold={threshold}
        />
      </div>
    </div>
  );
};
