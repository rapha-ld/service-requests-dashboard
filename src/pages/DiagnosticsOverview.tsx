
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { generateDailyData } from "@/utils/chartDataGenerator";
import { useServiceData } from "@/hooks/useServiceData";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { ViewTypeToggle } from "@/components/mau/ViewTypeToggle";
import { GroupingType, ViewType } from "@/types/serviceData";

const DiagnosticsOverview = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<ViewType>('net-new');
  
  // Use service data hook with 'all' dimension
  const { data: serviceData } = useServiceData(
    new Date().getMonth(), // current month
    'all' as GroupingType,  // all dimensions
    'month-to-date'  // month to date time range
  );
  
  // Generate mock data for the cards
  const metricsData = [
    {
      title: "Client Connections",
      value: 56821,
      unit: "",
      limit: 100000,
      percentUsed: 56.8, // 56821/100000 * 100
      status: "good" as const,
      chartData: generateDailyData(56821, 'steady'),
      detailsLink: "/client-connections"
    },
    {
      title: "Server MAU",
      value: 12450,
      unit: "", 
      limit: 20000,
      percentUsed: 62.3, // 12450/20000 * 100
      status: "moderate" as const,
      chartData: generateDailyData(12450, 'exponential'),
      detailsLink: "/server-mau"
    },
    {
      title: "Peak Server SDK Connections",
      value: 8765,
      unit: "",
      limit: 10000,
      percentUsed: 87.7, // 8765/10000 * 100
      status: "poor" as const,
      chartData: generateDailyData(8765, 'stepwise'),
      detailsLink: "/peak-server-connections"
    }
  ];
  
  // If we have real data from the service, update the card values
  if (serviceData) {
    // In a real implementation, we would map the service data to the cards
    console.log("Service data available:", serviceData);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Diagnostics Overview" />
        
        <div className="mb-4">
          <ViewTypeToggle
            viewType={viewType}
            onViewTypeChange={(type) => setViewType(type)}
            timeRange="month-to-date"
            visible={true}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metricsData.map((metric, index) => (
            <SummaryCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              status={metric.status}
              limit={metric.limit}
              percentUsed={metric.percentUsed}
              chartData={metric.chartData}
              detailsLink={metric.detailsLink}
              showProgressBar={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsOverview;
