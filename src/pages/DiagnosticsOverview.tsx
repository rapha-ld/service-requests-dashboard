
import React from "react";
import { useNavigate } from "react-router-dom";
import { SummaryCard } from "@/components/SummaryCard";
import { generateDailyData } from "@/utils/chartDataGenerator";
import { useServiceData } from "@/hooks/useServiceData";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { GroupingType } from "@/types/serviceData";

const DiagnosticsOverview = () => {
  const navigate = useNavigate();
  
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
      detailsLink: "/client-connections"
    },
    {
      title: "Server MAU",
      value: 12450,
      unit: "", 
      detailsLink: "/server-mau"
    },
    {
      title: "Peak Server SDK Connections",
      value: 8765,
      unit: "",
      detailsLink: "/peak-server-connections"
    }
  ];
  
  // If we have real data from the service, update the card values
  if (serviceData) {
    console.log("Service data available:", serviceData);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Diagnostics Overview" />
        
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
      </div>
    </div>
  );
};

export default DiagnosticsOverview;
