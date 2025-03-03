
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
  const remainingData = metricsData
    .filter(metric => metric.title !== "Seats") // Exclude Seats from remaining calculation
    .map(metric => ({
      title: metric.title,
      remaining: metric.limit - metric.value,
      percentRemaining: 100 - metric.percentUsed,
      unit: metric.unit
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
            heightClass={metric.title === "Seats" ? "h-[172px]" : undefined} // Add fixed height for Seats card
          />
        ))}
      </div>

      {/* Remaining this month card */}
      <div className="bg-card p-4 rounded-lg shadow-sm dark:bg-secondary dark:border dark:border-border mb-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Remaining this month</h3>
        <div className="overflow-x-auto">
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
                <tr key={index} className={index < remainingData.length - 1 ? "border-b" : ""}>
                  <td className="py-3 text-left">{item.title}</td>
                  <td className="py-3 text-right">{item.remaining.toLocaleString()}{item.unit}</td>
                  <td className="py-3 text-right">{item.percentRemaining.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
