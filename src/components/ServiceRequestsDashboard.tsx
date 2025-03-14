
import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { DateRange } from "@/types/mauTypes";

export const ServiceRequestsDashboard = () => {
  // State hooks
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<ViewType>('net-new');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [grouping, setGrouping] = useState<GroupingType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  // Effect to update chart type based on view type
  useEffect(() => {
    // For net-new view, use bar charts; for cumulative, use area charts
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  // Effect to update view type based on time range
  useEffect(() => {
    if (timeRange === 'last-12-months') {
      setViewType('net-new');
    } else if (timeRange === 'rolling-30-day') {
      // Always use cumulative view for 30-day range
      setViewType('cumulative');
    }
  }, [timeRange]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    
    // Set view type based on time range
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
    } else if (newTimeRange === 'rolling-30-day') {
      // Always use cumulative view for 30-day range
      setViewType('cumulative');
    }
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
    // Don't allow changing view type for rolling-30-day
    if (timeRange === 'rolling-30-day') return;
    
    setViewType(newViewType);
    // Update chart type based on view type
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
  };
  
  // Fetch data using custom hook
  const { data: serviceData } = useServiceData(
    selectedMonth, 
    grouping, 
    timeRange,
    timeRange === 'custom' ? customDateRange : undefined
  );

  if (!serviceData) return null;
  
  // Process data for display
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  // Calculate maxValue
  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  // Get data for all environments chart
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Service Connections</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={setGrouping}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showViewTypeToggle={timeRange !== 'last-12-months' && timeRange !== 'rolling-30-day'}
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
        />
      </div>
    </div>
  );
};
