
import React, { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TotalChart } from "@/components/charts/TotalChart";
import { exportChartAsPNG } from "@/components/charts/exportChart";
import { useServiceData } from "@/hooks/useServiceData";
import { useUrlParams } from "@/hooks/useUrlParams";
import { DateRange } from "@/types/mauTypes";
import { TimeRangeType, ViewType } from "@/types/serviceData";

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
  
  // If data doesn't match expected structures, create placeholder data
  const today = new Date();
  const placeholderData = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const day = date.toISOString().split('T')[0];
    placeholderData.push({
      day,
      value: Math.floor(Math.random() * 1000) // Random placeholder value
    });
  }
  
  return placeholderData;
};

export default function Diagnostics() {
  // Local state for custom date range
  const [localDateRange, setLocalDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  // Get URL parameters
  const urlParams = useUrlParams();

  // Get state from URL parameters
  const viewType = urlParams.getViewType();
  const grouping = urlParams.getGrouping();
  const timeRange = urlParams.getTimeRange();
  const selectedMonth = urlParams.getSelectedMonth();
  const sortDirection = urlParams.getSortDirection();
  const chartType = urlParams.getChartType();

  // Set initial localDateRange from URL if available
  useEffect(() => {
    const urlDateRange = urlParams.getCustomDateRange();
    setLocalDateRange(urlDateRange);
  }, []);

  // Update URL when localDateRange changes
  useEffect(() => {
    if (timeRange === 'custom') {
      urlParams.setCustomDateRange(localDateRange);
    }
  }, [localDateRange, timeRange]);

  // Handle view type change
  const handleViewTypeChange = (value: ViewType) => {
    urlParams.setViewType(value);
  };

  // Handle grouping change
  const handleGroupingChange = (value: typeof grouping) => {
    urlParams.setGrouping(value);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRangeType) => {
    urlParams.setTimeRange(value);
  };

  // Handle month change
  const handleMonthChange = (value: string) => {
    urlParams.setSelectedMonth(parseInt(value));
  };

  // Handle sort direction change
  const handleSortDirectionChange = () => {
    urlParams.setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  // Handle custom date range change
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setLocalDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };

  // Client Connections data
  const { data: clientConnectionsData, isLoading: isLoadingClientConnections } = useServiceData(
    'client-connections',
    viewType,
    timeRange,
    localDateRange
  );

  // Server MAU data
  const { data: serverMAUData, isLoading: isLoadingServerMAU } = useServiceData(
    'server-mau',
    viewType,
    timeRange,
    localDateRange
  );

  // Peak Server Connections data
  const { data: peakServerConnectionsData, isLoading: isLoadingPeakServerConnections } = useServiceData(
    'peak-server-connections',
    viewType,
    timeRange,
    localDateRange
  );

  // Service Requests data
  const { data: serviceRequestsData, isLoading: isLoadingServiceRequests } = useServiceData(
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

  const isLoading = isLoadingClientConnections || isLoadingServerMAU || 
                  isLoadingPeakServerConnections || isLoadingServiceRequests;

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
            unitLabel="connections"
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
            unitLabel="users"
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
            unitLabel="connections"
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
            unitLabel="requests"
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
}
