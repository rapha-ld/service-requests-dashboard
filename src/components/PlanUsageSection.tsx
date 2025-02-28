
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
}

interface PlanUsageSectionProps {
  metricsData: MetricData[];
}

export const PlanUsageSection: React.FC<PlanUsageSectionProps> = ({ metricsData }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-left">Plan Usage</h3>
          <Link 
            to="/upgrade" 
            className="text-xs hover:underline"
            style={{ color: "#6E59A5" }}
          >
            Upgrade
          </Link>
        </div>
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
    </>
  );
};
