import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";

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
  const [hourlyData, setHourlyData] = useState(false);
  
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

  // Check if custom date range is 3 days or less
  const isCustomDateRangeShort = () => {
    if (timeRange === 'custom' && customDateRange) {
      const { from, to } = customDateRange;
      if (from && to) {
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      }
    }
    return false;
  };

  // Effect to enable/disable hourly data based on time range
  useEffect(() => {
    if (timeRange === '3-day' || isCustomDateRangeShort()) {
      setHourlyData(true);
    } else {
      setHourlyData(false);
    }
  }, [timeRange, customDateRange]);

  // Effect to update viewType when timeRange changes to 3-day or short custom range
  useEffect(() => {
    if ((timeRange === '3-day' || isCustomDateRangeShort()) && viewType === 'rolling-30d') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
    }
  }, [timeRange, customDateRange]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
    
    // Force net-new view when 12M is selected
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
    
    // If switching to 3-day and current viewType is rolling-30d, switch to net-new
    if (newTimeRange === '3-day' && viewType === 'rolling-30d') {
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
    
    // Check if the new custom date range is short (≤ 3 days)
    const { from, to } = dateRange;
    if (from && to) {
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If it's a short range and viewType is rolling-30d, switch to net-new
      if (diffDays <= 3 && viewType === 'rolling-30d') {
        setViewType('net-new');
        urlParams.setViewType('net-new');
        setChartType('bar');
        urlParams.setChartType('bar');
      }
    }
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
    // Only allow changing if not in 12M view
    if (timeRange !== 'last-12-months') {
      // Check if timeRange is 3-day or short custom range and attempting to set rolling-30d
      if ((timeRange === '3-day' || isCustomDateRangeShort()) && newViewType === 'rolling-30d') {
        return; // Prevent setting to rolling-30d when in 3-day view or short custom range
      }
      
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
  const { data: serviceData } = useServiceData(
    selectedMonth, 
    grouping, 
    timeRange,
    timeRange === 'custom' ? customDateRange : undefined,
    hourlyData
  );

  if (!serviceData) return null;
  
  // Process data for display
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  // Calculate maxValue - updated to accept the new ViewType
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Get data for all environments chart
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups, hourlyData);

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
          showViewTypeToggle={false}
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
          disableViewTypeToggle={timeRange === 'last-12-months'}
          timeRange={timeRange}
          threshold={SERVICE_CONNECTIONS_THRESHOLD}
          customDateRange={customDateRange}
          isHourlyData={hourlyData}
        />
      </div>
    </div>
  );
};
