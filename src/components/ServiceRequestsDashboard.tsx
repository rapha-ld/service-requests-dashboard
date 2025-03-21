
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
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
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
    // For net-new view, use bar charts; for cumulative, use area charts; for rolling-30d, use line charts
    if (viewType === 'net-new') {
      setChartType('bar');
    } else if (viewType === 'rolling-30d') {
      setChartType('line');
    } else {
      setChartType('area');
    }
  }, [viewType]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    
    // Force net-new view when 12M is selected
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      setChartType('bar');
    }
  };
  
  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
    // Only allow changing if not in 12M view
    if (timeRange !== 'last-12-months') {
      setViewType(newViewType);
      // Update chart type based on view type
      if (newViewType === 'net-new') {
        setChartType('bar');
      } else if (newViewType === 'rolling-30d') {
        setChartType('line');
      } else {
        setChartType('area');
      }
    }
  };
  
  // Handle month change
  const handleMonthChange = (value: string) => {
    // Value now contains both month and year, separated by a comma
    const [month, year] = value.split(',').map(Number);
    setSelectedMonth(month);
    setSelectedYear(year);
    console.log(`Month changed to: ${month}, Year: ${year}`);
  };
  
  // Fetch data using custom hook
  const { data: serviceData, isLoading, error } = useServiceData(
    selectedMonth, 
    selectedYear,
    grouping, 
    timeRange,
    timeRange === 'custom' ? customDateRange : undefined
  );

  // Log for debugging
  useEffect(() => {
    console.log(`Dashboard rendering with month: ${selectedMonth + 1}, year: ${selectedYear}`);
  }, [selectedMonth, selectedYear]);

  if (isLoading) return <div className="p-6">Loading data...</div>;
  if (error) return <div className="p-6">Error loading data: {String(error)}</div>;
  if (!serviceData) return <div className="p-6">No data available</div>;
  
  // Process data for display
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  // Calculate maxValue - updated to accept the new ViewType
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
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};
