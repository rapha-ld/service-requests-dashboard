
import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData, GroupingType, TimeRangeType, ViewType, ChartType } from "@/hooks/useServiceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";

export const ServiceRequestsDashboard = () => {
  // State hooks
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<ViewType>('net-new');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [grouping, setGrouping] = useState<GroupingType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  // Effect to reset viewType to 'net-new' when timeRange is 'last-12-months'
  useEffect(() => {
    if (timeRange === 'last-12-months') {
      setViewType('net-new');
    }
  }, [timeRange]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
    }
  };
  
  // Fetch data using custom hook
  const { data: serviceData } = useServiceData(selectedMonth, grouping, timeRange);

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
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Service Requests</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={setGrouping}
          onViewTypeChange={setViewType}
          onChartTypeChange={setChartType}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
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
        />
      </div>
    </div>
  );
};

