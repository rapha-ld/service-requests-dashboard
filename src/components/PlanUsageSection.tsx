
import React from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    unit: metric.unit === "users" || metric.unit === "seats" ? "" : metric.unit // Remove "users" and "seats" units
  }));
  
  // Function to format title with MAU tooltip
  const formatTitle = (title: string) => {
    if (!title.includes('MAU')) return title;
    
    const parts = title.split('MAU');
    return (
      <>
        {parts[0]}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="border-b border-dashed border-current">MAU</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Monthly Active Users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {parts[1]}
      </>
    );
  };
  
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
          <div className="bg-card p-4 rounded-lg shadow-sm dark:bg-secondary dark:border dark:border-border h-[224px]">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-left">Remaining this month</h3>
            <div className="overflow-y-auto max-h-[168px]">
              <table className="w-full text-sm">
                <tbody>
                  {remainingData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 text-left text-muted-foreground">
                        {formatTitle(item.title)}
                      </td>
                      <td className="py-2 text-right">
                        <span className={item.remaining === 0 ? "text-[#ea384c]" : ""}>
                          {item.remaining.toLocaleString()}{item.unit}
                        </span>
                      </td>
                      <td className="py-2 text-right">{Math.round(item.percentRemaining)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
