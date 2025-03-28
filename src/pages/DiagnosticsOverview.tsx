
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { generateDailyData } from "@/utils/chartDataGenerator";
import { useServiceData } from "@/hooks/useServiceData";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { GroupingType } from "@/types/serviceData";
import { TotalChart } from "@/components/charts/TotalChart";
import { ViewTypeToggle } from "@/components/mau/ViewTypeToggle";

const DiagnosticsOverview = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [viewType, setViewType] = useState<'net-new' | 'cumulative' | 'rolling-30d'>('net-new');
  
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
      detailsLink: "/client-connections",
      chartData: generateDailyData(56821, 'steady')
    },
    {
      title: "Server MAU",
      value: 12450,
      unit: "", 
      detailsLink: "/server-mau",
      chartData: generateDailyData(12450, 'exponential')
    },
    {
      title: "Peak Server SDK Connections",
      value: 8765,
      unit: "",
      detailsLink: "/peak-server-connections",
      chartData: generateDailyData(8765, 'stepwise')
    }
  ];
  
  // If we have real data from the service, update the card values
  if (serviceData) {
    console.log("Service data available:", serviceData);
  }

  // Handle exporting chart
  const handleExportChart = (title: string) => {
    console.log(`Exporting ${title} chart...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Diagnostics Overview" />
        
        <div className="mb-6">
          <ViewTypeToggle
            viewType={viewType}
            onViewTypeChange={setViewType}
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
              status="good"
              detailsLink={metric.detailsLink}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          {metricsData.map((metric, index) => (
            <div key={`chart-${index}`} className="bg-card rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium mb-4">{metric.title}</h3>
              <div className="h-[250px]">
                <TotalChart
                  title={metric.title}
                  data={metric.chartData}
                  viewType={viewType}
                  chartType={viewType === 'net-new' ? 'bar' : 'area'}
                  chartRef={chartRef}
                  onExportChart={handleExportChart}
                  useViewDetailsButton={true}
                  unitLabel={metric.unit}
                  showThreshold={false}
                  timeRange="month-to-date"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsOverview;
