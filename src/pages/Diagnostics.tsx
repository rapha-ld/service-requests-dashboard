
import React, { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TotalChart } from "@/components/charts/TotalChart";
import { exportChartAsPNG } from "@/components/charts/exportChart";
import { useServiceData } from "@/hooks/useServiceData";
import { useUrlParams } from "@/hooks/useUrlParams";
import { DateRange } from "@/types/mauTypes";
import { TimeRangeType } from "@/types/serviceData";

// Helper function to extract total data safely
const extractTotalData = (serviceData: any): Array<{ day: string; value: number }> => {
  if (!serviceData) return [];
  
  // Handle different data structures that might be returned by useServiceData
  if (Array.isArray(serviceData.data)) {
    return serviceData.data;
  }
  
  if (serviceData.current && serviceData.current.total && Array.isArray(serviceData.current.total)) {
    return serviceData.current.total;
  }
  
  return [];
};

export default function Diagnostics() {
  // Local state for custom date range
  const [localDateRange, setLocalDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  // Get URL parameters
  const {
    getViewType,
    getGrouping,
    getTimeRange,
    getSelectedMonth,
    getSortDirection,
    getChartType,
    getCustomDateRange,
    setViewType,
    setGrouping,
    setTimeRange,
    setSelectedMonth,
    setSortDirection,
    setChartType,
    setCustomDateRange: setUrlCustomDateRange
  } = useUrlParams();

  // Get state from URL parameters
  const viewType = getViewType();
  const grouping = getGrouping();
  const timeRange = getTimeRange();
  const selectedMonth = getSelectedMonth();
  const sortDirection = getSortDirection();
  const chartType = getChartType();

  // Set initial localDateRange from URL if available
  useEffect(() => {
    const urlDateRange = getCustomDateRange();
    setLocalDateRange(urlDateRange);
  }, []);

  // Update URL when localDateRange changes
  useEffect(() => {
    if (timeRange === 'custom') {
      setUrlCustomDateRange(localDateRange);
    }
  }, [localDateRange, timeRange]);

  // Handle view type change
  const handleViewTypeChange = (value: typeof viewType) => {
    setViewType(value);
  };

  // Handle grouping change
  const handleGroupingChange = (value: typeof grouping) => {
    setGrouping(value);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRangeType) => {
    setTimeRange(value);
  };

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  // Handle sort direction change
  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setLocalDateRange(dateRange);
    setUrlCustomDateRange(dateRange);
  };

  // Client Connections data
  const clientConnectionsData = useServiceData(
    'client-connections',
    viewType,
    timeRange,
    localDateRange
  );

  // Server MAU data
  const serverMAUData = useServiceData(
    'server-mau',
    viewType,
    timeRange,
    localDateRange
  );

  // Peak Server Connections data
  const peakServerConnectionsData = useServiceData(
    'peak-server-connections',
    viewType,
    timeRange,
    localDateRange
  );

  // Service Requests data
  const serviceRequestsData = useServiceData(
    'service-requests',
    viewType,
    timeRange,
    localDateRange
  );

  // Chart refs for export functionality
  const clientConnectionsChartRef = useRef(null);
  const serverMAUChartRef = useRef(null);
  const peakServerConnectionsChartRef = useRef(null);
  const serviceRequestsChartRef = useRef(null);

  // Handle chart export
  const handleExportChart = (chartRef: React.MutableRefObject<any>, title: string) => {
    if (chartRef.current) {
      exportChartAsPNG(chartRef, title);
    }
  };

  const isLoading = clientConnectionsData.isLoading || serverMAUData.isLoading || 
                  peakServerConnectionsData.isLoading || serviceRequestsData.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground mb-6 text-left">Diagnostics Overview</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the service data responses
  const clientConnectionsChartData = extractTotalData(clientConnectionsData);
  const serverMAUChartData = extractTotalData(serverMAUData);
  const peakServerConnectionsChartData = extractTotalData(peakServerConnectionsData);
  const serviceRequestsChartData = extractTotalData(serviceRequestsData);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left">Diagnostics Overview</h1>
        
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
          showGrouping={false}
          showViewTypeToggle={true}
          customDateRange={localDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TotalChart
            title="Client Connections"
            data={clientConnectionsChartData}
            viewType={viewType}
            chartType={chartType}
            chartRef={clientConnectionsChartRef}
            onExportChart={() => handleExportChart(clientConnectionsChartRef, "Client Connections")}
            useViewDetailsButton={true}
            unitLabel=""
            timeRange={timeRange}
          />
          
          <TotalChart
            title="Server MAU"
            data={serverMAUChartData}
            viewType={viewType}
            chartType={chartType}
            chartRef={serverMAUChartRef}
            onExportChart={() => handleExportChart(serverMAUChartRef, "Server MAU")}
            useViewDetailsButton={true}
            unitLabel=""
            timeRange={timeRange}
          />
          
          <TotalChart
            title="Peak Server SDK Connections"
            data={peakServerConnectionsChartData}
            viewType={viewType}
            chartType={chartType}
            chartRef={peakServerConnectionsChartRef}
            onExportChart={() => handleExportChart(peakServerConnectionsChartRef, "Peak Server SDK Connections")}
            useViewDetailsButton={true}
            unitLabel=""
            timeRange={timeRange}
          />
          
          <TotalChart
            title="Service Requests"
            data={serviceRequestsChartData}
            viewType={viewType}
            chartType={chartType}
            chartRef={serviceRequestsChartRef}
            onExportChart={() => handleExportChart(serviceRequestsChartRef, "Service Requests")}
            useViewDetailsButton={true}
            unitLabel=""
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
}
