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

  // Generate non-cumulative daily data that will add up to the target value
  const generateDailyData = (targetValue: number, growthPattern: 'steady' | 'exponential' | 'stepwise') => {
    const data = [];
    
    // Start date: January 24, 2024
    const startDate = new Date(2024, 0, 24);
    // End date: February 22, 2024 (approx. 30 days)
    const endDate = new Date(2024, 1, 22);
    // Full month end date: February 29, 2024 (for x-axis display only)
    const fullMonthEndDate = new Date(2024, 1, 29);
    
    // Calculate different growth patterns for daily values
    const daysWithData = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate daily values that will add up to targetValue
    let dailyValues = [];
    let remainingValue = targetValue;
    
    for (let i = 0; i < daysWithData; i++) {
      // Last day gets whatever is left to ensure exact sum
      if (i === daysWithData - 1) {
        dailyValues.push(remainingValue);
        continue;
      }

      let portion;
      switch (growthPattern) {
        case 'exponential':
          // Exponential growth: smaller portions early, larger portions later
          portion = Math.exp(i / daysWithData * 2) / Math.exp(2);
          break;
        case 'stepwise':
          // Stepwise growth: random jumps
          const step = Math.floor(i / (daysWithData / 5));
          portion = 0.1 + (step * 0.25) + (Math.random() * 0.1 - 0.05);
          break;
        case 'steady':
        default:
          // Steady growth with some fluctuation
          portion = 1/daysWithData + (Math.random() * 0.02 - 0.01);
          break;
      }
      
      // Calculate daily value based on portion and ensure we don't exceed remaining
      let dailyValue = Math.round(targetValue * portion);
      dailyValue = Math.min(dailyValue, remainingValue);
      dailyValue = Math.max(1, dailyValue); // Ensure at least 1 per day
      
      dailyValues.push(dailyValue);
      remainingValue -= dailyValue;
    }
    
    // Normalize to ensure we hit exactly the target
    if (dailyValues.reduce((sum, value) => sum + value, 0) !== targetValue) {
      const lastDayIndex = daysWithData - 1;
      dailyValues[lastDayIndex] = targetValue - dailyValues.slice(0, lastDayIndex).reduce((sum, value) => sum + value, 0);
    }
    
    // Convert daily values to the format needed for the chart
    for (let i = 0; i < daysWithData; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Format date as "MMM DD" (e.g., "Jan 24")
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      data.push({
        day: formattedDate,
        value: dailyValues[i]
      });
    }
    
    // Now add empty data points for the rest of the month (after Feb 22)
    const remainingDays = Math.floor((fullMonthEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 1; i <= remainingDays; i++) {
      const currentDate = new Date(endDate);
      currentDate.setDate(endDate.getDate() + i);
      
      // Format date as "MMM DD" (e.g., "Feb 23")
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Add data point with null value to show on x-axis but not in the area chart
      data.push({
        day: formattedDate,
        value: null
      });
    }
    
    return data;
  };

  const chartData = {
    clientMAU: generateDailyData(metricsData[1].value, 'steady'),
    experimentEvents: generateDailyData(metricsData[2].value, 'exponential'),
    dataExportEvents: generateDailyData(metricsData[3].value, 'stepwise')
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
              showThreshold={true}
            />
            <SmallMultiple
              title="Experiment Events"
              data={chartData.experimentEvents}
              color="#394497"
              unit=""
              viewType="cumulative"
              maxValue={metricsData[2].limit}
              chartType="area"
              showThreshold={true}
            />
            <SmallMultiple
              title="Data Export Events"
              data={chartData.dataExportEvents}
              color="#394497"
              unit=""
              viewType="cumulative"
              maxValue={metricsData[3].limit}
              chartType="area"
              showThreshold={true}
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
