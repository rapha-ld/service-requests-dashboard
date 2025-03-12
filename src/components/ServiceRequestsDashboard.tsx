import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useServiceData } from "@/hooks/useServiceData";
import { GroupingType, TimeRangeType, ViewType, ChartType } from "@/types/serviceData";
import { processServiceData, calculateMaxValue, getAllEnvironmentsData } from "@/utils/serviceDataUtils";

export const ServiceRequestsDashboard = () => {
  // State hooks
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<ViewType>('cumulative'); // Changed default to cumulative
  const [chartType, setChartType] = useState<ChartType>('area'); // Changed default to area for cumulative view
  const [grouping, setGrouping] = useState<GroupingType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const chartRefs = useRef<{ [key: string]: any }>({});
  
  // Effect to set viewType to 'cumulative' when timeRange is 'month-to-date' or 'rolling-30-day'
  useEffect(() => {
    if ((timeRange === 'month-to-date' || timeRange === 'rolling-30-day') && viewType !== 'cumulative') {
      setViewType('cumulative');
    } else if (timeRange === 'last-12-months') {
      setViewType('net-new');
    }
  }, [timeRange, viewType]);
  
  // Effect to set chart type based on view type
  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
    } else {
      setViewType('cumulative');
    }
  };
  
  // Handle view type change
  const handleViewTypeChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
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
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={setGrouping}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showViewTypeToggle={false} // Add this to hide the toggle
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
