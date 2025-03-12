import React from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { RemainingUsageTable } from "./plan-usage/RemainingUsageTable";
import { PlanUsageSectionHeader } from "./plan-usage/PlanUsageSectionHeader";
import { MetricData, calculateRemainingData, findCardByTitle } from "@/utils/planUsageUtils";

interface PlanUsageSectionProps {
  metricsData: MetricData[];
}

export const PlanUsageSection: React.FC<PlanUsageSectionProps> = ({ metricsData }) => {
  // Find the Data Export Events card to extract its action
  const dataExportCard = findCardByTitle(metricsData, "Data Export Events");
  
  // Calculate remaining values for the "Remaining this month" card
  const remainingData = calculateRemainingData(metricsData);
  
  return (
    <>
      <PlanUsageSectionHeader action={dataExportCard?.action} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* First column: Seats card and Remaining this month card */}
        <div className="flex flex-col gap-4">
          {/* Seats card */}
          {metricsData.filter(metric => metric.title === "Seats").map((metric, index) => (
            <SummaryCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit="" // Remove "seats" unit
              status={metric.status}
              limit={metric.limit}
              percentUsed={metric.percentUsed}
              action={metric.action}
              heightClass="h-[140px]" // Increased height from 120px to 140px
            />
          ))}
          
          {/* Remaining this month card */}
          <RemainingUsageTable remainingData={remainingData} />
        </div>
        
        {/* Other metric cards */}
        {metricsData.filter(metric => metric.title !== "Seats").map((metric, index) => (
          <SummaryCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.title === "Client MAU" || metric.title === "Seats" ? "" : metric.unit} // Remove "users" for Client MAU and "seats" for Seats
            status={metric.status}
            limit={metric.limit}
            percentUsed={metric.percentUsed}
            action={metric.title === "Data Export Events" ? undefined : metric.action}
            chartData={metric.chartData}
            detailsLink={metric.detailsLink}
          />
        ))}
      </div>
    </>
  );
};
