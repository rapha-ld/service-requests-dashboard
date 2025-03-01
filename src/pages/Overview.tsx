
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlanUsageSection } from "@/components/PlanUsageSection";
import { UsageTrendsSection } from "@/components/UsageTrendsSection";
import { generateDailyData } from "@/utils/chartDataGenerator";

const Overview = () => {
  // Mock data for the cards
  const metricsData = [
    {
      title: "Seats",
      value: 42,
      unit: "seats",
      limit: 50,
      percentUsed: 84, // 42/50 * 100
      status: "good" as const
    },
    {
      title: "Client MAU",
      value: 18450,
      unit: "users",
      limit: 25000,
      percentUsed: 73.8, // 18450/25000 * 100
      status: "moderate" as const
    },
    {
      title: "Experiment Events",
      value: 325765,
      unit: "",
      limit: 500000,
      percentUsed: 65.15, // 325765/500000 * 100
      status: "good" as const
    },
    {
      title: "Data Export Events",
      value: 100000,
      unit: "",
      limit: 100000,
      percentUsed: 100, // 100000/100000 * 100
      status: "poor" as const,
      action: (
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          Upgrade Plan
        </Button>
      )
    }
  ];

  const chartData = {
    clientMAU: generateDailyData(metricsData[1].value, 'steady'),
    experimentEvents: generateDailyData(metricsData[2].value, 'exponential'),
    dataExportEvents: generateDailyData(metricsData[3].value, 'stepwise')
  };

  const metricsInfo = {
    clientMAU: {
      title: metricsData[1].title,
      limit: metricsData[1].limit
    },
    experimentEvents: {
      title: metricsData[2].title,
      limit: metricsData[2].limit
    },
    dataExportEvents: {
      title: metricsData[3].title,
      limit: metricsData[3].limit
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left">Overview</h1>
        
        <PlanUsageSection metricsData={metricsData} />
        
        <div className="mt-8 mb-4">
          <UsageTrendsSection chartData={chartData} metricsInfo={metricsInfo} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Additional Information</h2>
          <p className="text-muted-foreground">More detailed analytics and reports coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
