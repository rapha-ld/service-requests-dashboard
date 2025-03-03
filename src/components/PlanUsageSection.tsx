
import React from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MetricData {
  title: string;
  value: number;
  unit: string;
  limit: number;
  percentUsed: number;
  status: "good" | "moderate" | "poor";
  action?: React.ReactNode;
  chartData?: Array<{ day: string; value: number | null }>;
  detailsLink?: string;
}

interface PlanUsageSectionProps {
  metricsData: MetricData[];
}

export const PlanUsageSection: React.FC<PlanUsageSectionProps> = ({ metricsData }) => {
  // Find the Data Export Events card to extract its action
  const dataExportCard = metricsData.find(metric => metric.title === "Data Export Events");
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-sm font-semibold text-muted-foreground text-left">Plan Usage</h3>
          <p className="text-xs text-muted-foreground">Will reset on Feb 28 at 4:00 PM PST</p>
          <Link 
            to="/upgrade" 
            className="text-xs text-muted-foreground underline hover:no-underline"
          >
            Upgrade
          </Link>
        </div>
        {dataExportCard?.action && (
          <div className="mb-2">
            {dataExportCard.action}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metricsData.map((metric, index) => (
          <SummaryCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            status={metric.status}
            limit={metric.limit}
            percentUsed={metric.percentUsed}
            action={metric.title === "Data Export Events" ? undefined : metric.action}
            chartData={metric.title !== "Seats" ? metric.chartData : undefined}
            detailsLink={metric.detailsLink}
          />
        ))}
      </div>
    </>
  );
};
