
import React from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { Button } from "@/components/ui/button";
import { SmallMultiple } from "@/components/SmallMultiple";
import { Link } from "react-router-dom";

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

  // Mock chart data for each metric
  const generateChartData = (finalValue: number) => {
    // Generate 30 days of data points leading up to the final value
    const data = [];
    const daysInMonth = 30;
    
    // For cumulative data, we'll create a gradual increase
    const baseValue = finalValue * 0.7; // Start at 70% of final value
    const dailyIncrease = (finalValue - baseValue) / daysInMonth;
    
    for (let i = 0; i < daysInMonth; i++) {
      const dayValue = Math.round(baseValue + (dailyIncrease * i));
      data.push({
        day: (i + 1).toString(), // Day 1-30
        value: i === daysInMonth - 1 ? finalValue : dayValue
      });
    }
    
    return data;
  };

  const chartData = {
    clientMAU: generateChartData(metricsData[1].value),
    experimentEvents: generateChartData(metricsData[2].value),
    dataExportEvents: generateChartData(metricsData[3].value)
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Overview</h1>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground text-left">Plan Usage</h3>
          <Link 
            to="/upgrade" 
            className="text-sm text-primary hover:underline"
          >
            Upgrade plan
          </Link>
        </div>
        
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
              action={metric.action}
            />
          ))}
        </div>
        
        <div className="mt-8 mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-left">Usage Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SmallMultiple
              title="Client MAU"
              data={chartData.clientMAU}
              color="#394497"
              unit=" users"
              viewType="cumulative"
              maxValue={metricsData[1].limit}
              chartType="area"
            />
            <SmallMultiple
              title="Experiment Events"
              data={chartData.experimentEvents}
              color="#394497"
              unit=""
              viewType="cumulative"
              maxValue={metricsData[2].limit}
              chartType="area"
            />
            <SmallMultiple
              title="Data Export Events"
              data={chartData.dataExportEvents}
              color="#394497"
              unit=""
              viewType="cumulative"
              maxValue={metricsData[3].limit}
              chartType="area"
            />
          </div>
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
