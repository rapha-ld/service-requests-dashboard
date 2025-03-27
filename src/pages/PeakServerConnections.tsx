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
import { isCustomDateRangeShort } from "@/utils/chartPropertiesFactory";

const PeakServerConnections = () => {
  const urlParams = useUrlParams();
  const location = useLocation();
  
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<ViewType>(urlParams.getViewType());
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>(urlParams.getChartType());
  const [grouping, setGrouping] = useState<GroupingType>(urlParams.getGrouping());
  const [timeRange, setTimeRange] = useState<TimeRangeType>(urlParams.getTimeRange());
  const [customDateRange, setCustomDateRange] = useState<DateRange>(urlParams.getCustomDateRange());
  const [hourlyData, setHourlyData] = useState(false);
  
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  useEffect(() => {
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
  
  useEffect(() => {
    if (timeRange === '3-day' || isCustomDateRangeShort(timeRange, customDateRange)) {
      setHourlyData(true);
    } else {
      setHourlyData(false);
    }
  }, [timeRange, customDateRange]);
  
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  const handleViewTypeChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    urlParams.setViewType(newViewType);
    
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
  
  const handleGroupingChange = (newGrouping: GroupingType) => {
    setGrouping(newGrouping);
    urlParams.setGrouping(newGrouping);
  };
  
  const handleSortDirectionChange = () => {
    const newSortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newSortDirection);
    urlParams.setSortDirection(newSortDirection);
  };
  
  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setSelectedMonth(newMonth);
    urlParams.setSelectedMonth(newMonth);
  };
  
  const { data: serviceData } = useServiceData(
    selectedMonth, 
    grouping, 
    timeRange,
    timeRange === 'custom' ? customDateRange : undefined,
    hourlyData
  );

  if (!serviceData) return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Peak Server SDK Connections</h1>
        <p className="text-muted-foreground">Loading connection data...</p>
      </div>
    </div>
  );
  
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  const totalConnections = Object.values(serviceData.currentTotals).reduce((sum, val) => sum + (val || 0), 0);
  const totalPreviousConnections = Object.values(serviceData.previousTotals).reduce((sum, val) => sum + (val || 0), 0);
  const totalPercentChange = totalPreviousConnections ? ((totalConnections - totalPreviousConnections) / totalPreviousConnections) * 100 : 0;
  
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups, hourlyData);

  const unitLabel = getUnitLabel(location.pathname.substring(1));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Peak Server SDK Connections</h1>
        
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
        
        {grouping !== 'all' && (
          <DashboardSummary 
            groups={sortedGroups} 
            totalConnections={totalConnections}
            totalPercentChange={totalPercentChange}
            showOnlyTotal={false}
          />
        )}
        
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
          disableViewTypeToggle={false}
          timeRange={timeRange}
          unitLabel={unitLabel || "connections"}
          isHourlyData={hourlyData}
          customDateRange={customDateRange}
          totalConnections={totalConnections}
          totalPercentChange={totalPercentChange}
        />
      </div>
    </div>
  );
};

export default PeakServerConnections;
