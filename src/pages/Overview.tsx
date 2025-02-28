
import React from "react";
import { SummaryCard } from "@/components/SummaryCard";

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
      value: 97500,
      unit: "",
      limit: 100000,
      percentUsed: 97.5, // 97500/100000 * 100
      status: "poor" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Overview</h1>
        
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-left">Account Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {metricsData.map((metric, index) => (
            <SummaryCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              status={metric.status}
              limit={metric.limit}
              percentUsed={metric.percentUsed}
            />
          ))}
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
