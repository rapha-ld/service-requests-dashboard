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
  
  // Calculate remaining values for the "Remaining this month" card
  const remainingData = metricsData.map(metric => ({
    title: metric.title,
    remaining: metric.limit - metric.value,
    percentRemaining: 100 - metric.percentUsed,
    unit: metric.unit === "users" ? "" : metric.unit // Remove "users" unit
  }));
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground text-left">Plan Usage</h3>
            <Link 
              to="/upgrade" 
              className="text-xs text-muted-foreground underline hover:no-underline"
            >
              Upgrade
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Will reset on Feb 28 at 4:00 PM PST</p>
        </div>
        {dataExportCard?.action && (
          <div className="mb-2">
            {dataExportCard.action}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Seats card */}
        {metricsData.filter(metric => metric.title === "Seats").map((metric, index) => (
          <SummaryCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            status={metric.status}
            limit={metric.limit}
            percentUsed={metric.percentUsed}
            action={metric.action}
            heightClass="h-[172px]"
          />
        ))}
        
        {/* Remaining this month card */}
        <div className="bg-card p-4 rounded-lg shadow-sm dark:bg-secondary dark:border dark:border-border h-[172px]">
          <h3 className="text-sm font-medium text-foreground mb-4">Remaining this month</h3>
          <div className="overflow-y-auto max-h-[116px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="text-left py-2 font-medium">Metric</th>
                  <th className="text-right py-2 font-medium">Remaining</th>
                  <th className="text-right py-2 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {remainingData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-left">{item.title}</td>
                    <td className="py-2 text-right">{item.remaining.toLocaleString()}{item.unit}</td>
                    <td className="py-2 text-right">{item.percentRemaining.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Other metric cards */}
        {metricsData.filter(metric => metric.title !== "Seats").map((metric, index) => (
          <SummaryCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.title === "Client MAU" ? "" : metric.unit} // Remove "users" for Client MAU
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
