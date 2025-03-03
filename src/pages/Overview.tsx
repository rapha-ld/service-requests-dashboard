
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlanUsageSection } from "@/components/PlanUsageSection";
import { generateDailyData } from "@/utils/chartDataGenerator";

const Overview = () => {
  // Generate chart data for each metric - using the exact same data as before
  const clientMAUChartData = generateDailyData(18450, 'steady');
  const experimentEventsChartData = generateDailyData(325765, 'exponential');
  const dataExportEventsChartData = generateDailyData(100000, 'stepwise');

  // Mock data for the cards - same as before but with chartData added
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
      status: "moderate" as const,
      chartData: clientMAUChartData
    },
    {
      title: "Experiment Events",
      value: 325765,
      unit: "",
      limit: 500000,
      percentUsed: 65.15, // 325765/500000 * 100
      status: "good" as const,
      chartData: experimentEventsChartData
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
      ),
      chartData: dataExportEventsChartData
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left">Overview</h1>
        
        <PlanUsageSection metricsData={metricsData} />
        
        <div className="mt-8">
          <p className="text-muted-foreground">More detailed analytics and reports coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
