import React, { useState, useRef, useEffect } from "react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";

const ServerMAU = () => {
  // State hooks
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<ViewType>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('bar');
  const [grouping, setGrouping] = useState<GroupingType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  // Effect to update chart type based on view type
  useEffect(() => {
    // For net-new view, use bar charts; for cumulative, use area charts; for rolling-30d, use line charts
    if (viewType === 'net-new') {
      setChartType('bar');
    } else if (viewType === 'rolling-30d') {
      setChartType('line');
    } else {
      setChartType('area');
    }
  }, [viewType]);
  
  // Handle time range change - no longer force cumulative for 30D
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
  };
  
  // Handle view type change - now we allow changing even for rolling-30-day
  const handleViewTypeChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    // Update chart type based on view type
    if (newViewType === 'net-new') {
      setChartType('bar');
    } else if (newViewType === 'rolling-30d') {
      setChartType('line');
    } else {
      setChartType('area');
    }
  };
  
  // Handle month change with proper parsing
  const handleMonthChange = (value: string) => {
    // Value now contains both month and year, separated by a comma
    const [month, year] = value.split(',').map(Number);
    setSelectedMonth(month);
    setSelectedYear(year);
  };
  
  // Fetch data using custom hook
  const { data: serviceData } = useServiceData(
    selectedMonth, 
    selectedYear,
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Server MAU</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={setGrouping}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
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
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={false}
          timeRange={timeRange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};

export default ServerMAU;
