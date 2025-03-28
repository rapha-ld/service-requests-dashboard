
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TotalChartSection } from "@/components/charts/TotalChartSection";
import { useServiceData } from "@/hooks/useServiceData";
import { useUrlParams } from "@/hooks/useUrlParams";
import { processServiceData, getAllEnvironmentsData } from "@/utils/serviceDataUtils";
import { ViewTypeToggle } from "@/components/dashboard/ViewTypeToggle";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GroupingType } from "@/types/serviceData";

export default function DiagnosticsOverview() {
  const urlParams = useUrlParams();
  
  const [selectedMonth, setSelectedMonth] = React.useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = React.useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = React.useState(urlParams.getViewType());
  const [chartType, setChartType] = React.useState(urlParams.getChartType());
  const [grouping, setGrouping] = React.useState<GroupingType>('all');
  const [timeRange, setTimeRange] = React.useState(urlParams.getTimeRange());
  const [customDateRange, setCustomDateRange] = React.useState(urlParams.getCustomDateRange());
  
  const chartRefs = useRef<{ [key: string]: any }>({ total: null });
  
  React.useEffect(() => {
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
  
  const handleTimeRangeChange = (newTimeRange: typeof timeRange) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
    
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
    }
  };
  
  const handleCustomDateRangeChange = (dateRange: typeof customDateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  const handleViewTypeChange = (newViewType: typeof viewType) => {
    setViewType(newViewType);
    urlParams.setViewType(newViewType);
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
    false
  );

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Diagnostics Overview</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { sortedGroups } = processServiceData(serviceData, sortDirection);
  
  const totalConnections = Object.values(serviceData.currentTotals).reduce((sum, val) => sum + (val || 0), 0);
  const totalPreviousConnections = Object.values(serviceData.previousTotals).reduce((sum, val) => sum + (val || 0), 0);
  const totalPercentChange = totalPreviousConnections ? ((totalConnections - totalPreviousConnections) / totalPreviousConnections) * 100 : 0;
  
  const allEnvironmentsData = getAllEnvironmentsData(grouping, serviceData, timeRange, sortedGroups, false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Diagnostics Overview</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={() => {}}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={handleSortDirectionChange}
          onMonthChange={handleMonthChange}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showGrouping={false}
          showViewTypeToggle={false}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
        />
        
        <div className="mb-8">
          <ViewTypeToggle
            viewType={viewType}
            onViewTypeChange={handleViewTypeChange}
            visible={true}
            timeRange={timeRange}
          />
        </div>
        
        <div className="space-y-8">
          {/* Client Connections Section */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">Client Connections</h2>
            <Link to="/client-connections" className="absolute top-0 right-0">
              <Button variant="outline" size="sm">View details</Button>
            </Link>
            <TotalChartSection
              allEnvironmentsData={allEnvironmentsData}
              viewType={viewType}
              chartType={chartType}
              chartRef={chartRefs.current.total}
              onExportChart={() => {}}
              useViewDetailsButton={false}
              unitLabel="connections"
              showThreshold={false}
              timeRange={timeRange}
              grouping={grouping}
              totalConnections={totalConnections}
              totalPercentChange={totalPercentChange}
            />
          </div>
          
          {/* Server MAU Section */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">Server MAU</h2>
            <Link to="/server-mau" className="absolute top-0 right-0">
              <Button variant="outline" size="sm">View details</Button>
            </Link>
            <TotalChartSection
              allEnvironmentsData={allEnvironmentsData}
              viewType={viewType}
              chartType={chartType}
              chartRef={chartRefs.current.total}
              onExportChart={() => {}}
              useViewDetailsButton={false}
              unitLabel="users"
              showThreshold={false}
              timeRange={timeRange}
              grouping={grouping}
              totalConnections={totalConnections}
              totalPercentChange={totalPercentChange}
            />
          </div>
          
          {/* Peak Server Connections Section */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">Peak Server SDK Connections</h2>
            <Link to="/peak-server-connections" className="absolute top-0 right-0">
              <Button variant="outline" size="sm">View details</Button>
            </Link>
            <TotalChartSection
              allEnvironmentsData={allEnvironmentsData}
              viewType={viewType}
              chartType={chartType}
              chartRef={chartRefs.current.total}
              onExportChart={() => {}}
              useViewDetailsButton={false}
              unitLabel="connections"
              showThreshold={false}
              timeRange={timeRange}
              grouping={grouping}
              totalConnections={totalConnections}
              totalPercentChange={totalPercentChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
