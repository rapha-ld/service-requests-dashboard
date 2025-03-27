import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlanUsageSection } from "@/components/PlanUsageSection";
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
      unit: "users", // We'll remove this in the display but keep it for calculation
      limit: 25000,
      percentUsed: 73.8, // 18450/25000 * 100
      status: "moderate" as const,
      chartData: generateDailyData(18450, 'steady'),
      detailsLink: "/client-mau"
    },
    {
      title: "Experiment Events",
      value: 325765,
      unit: "",
      limit: 500000,
      percentUsed: 65.15, // 325765/500000 * 100
      status: "good" as const,
      chartData: generateDailyData(325765, 'exponential'),
      detailsLink: "/experiments"
    },
    {
      title: "Data Export Events",
      value: 100000,
      unit: "",
      limit: 100000,
      percentUsed: 100, // 100000/100000 * 100
      status: "poor" as const,
      chartData: generateDailyData(100000, 'stepwise'),
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-2 text-xs bg-[#425EFF] text-white hover:bg-[#425EFF]/90 border-[#425EFF]"
        >
          Upgrade Plan
        </Button>
      ),
      detailsLink: "/data-export"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left">Overview</h1>
        
        <PlanUsageSection metricsData={metricsData} />
      </div>
    </div>
  );
};

export default Overview;
