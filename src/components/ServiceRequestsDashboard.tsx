
import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";

const SERVICE_CONNECTIONS_THRESHOLD = 15000;

export const ServiceRequestsDashboard = () => {
  const urlParams = useUrlParams();
  
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<ViewType>(urlParams.getViewType());
  const [chartType, setChartType] = useState<ChartType>(urlParams.getChartType());
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

  useEffect(() => {
    if (timeRange === '3-day' || isCustomDateRangeShort()) {
      setHourlyData(true);
    } else {
      setHourlyData(false);
    }
  }, [timeRange, customDateRange]);

  useEffect(() => {
    if ((timeRange === '3-day' || isCustomDateRangeShort()) && viewType === 'rolling-30d') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
    }
  }, [timeRange, customDateRange]);
  
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
    
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
    
    if (newTimeRange === '3-day' && viewType === 'rolling-30d') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
    
    const { from, to } = dateRange;
    if (from && to) {
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3 && viewType === 'rolling-30d') {
        setViewType('net-new');
        urlParams.setViewType('net-new');
        setChartType('bar');
        urlParams.setChartType('bar');
      }
    }
  };
  
  const handleViewTypeChange = (newViewType: ViewType) => {
    if (timeRange !== 'last-12-months') {
      if ((timeRange === '3-day' || isCustomDateRangeShort()) && newViewType === 'rolling-30d') {
        return;
      }
      
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

  if (!serviceData) return null;
  
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Always get combined data across all dimensions, regardless of current grouping
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups, hourlyData);

  const useIndividualMaxValues = viewType === 'cumulative';

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
          showThreshold={true} // Always show threshold in total chart
          individualMaxValues={useIndividualMaxValues}
        />
      </div>
    </div>
  );
};
