
import React, { useState, useRef, useEffect } from "react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { getUnitLabel } from "@/utils/chartUtils";
import { useLocation } from "react-router-dom";

const ServerMAU = () => {
  const urlParams = useUrlParams();
  const location = useLocation();
  
  // State hooks with values from URL parameters
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<ViewType>(urlParams.getViewType());
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>(urlParams.getChartType());
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
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
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
    timeRange === 'custom' ? customDateRange : undefined
  );

  if (!serviceData) return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Server MAU</h1>
        <p className="text-muted-foreground">Loading server data...</p>
      </div>
    </div>
  );
  
  // Process data for display
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  // Calculate maxValue
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Get data for all environments chart
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups);

  // Get the appropriate unit label based on the current route
  const unitLabel = getUnitLabel(location.pathname.substring(1)); // Remove leading slash

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Server MAU</h1>
        
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
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={false} // Always allow toggle
          timeRange={timeRange}
          unitLabel={unitLabel || "users"}
        />
      </div>
    </div>
  );
};

export default ServerMAU;
