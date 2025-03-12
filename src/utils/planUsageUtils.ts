
import { FormattedCardTitle } from "@/components/card/FormattedCardTitle";

export interface MetricData {
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

export interface RemainingItem {
  title: string;
  remaining: number;
  percentRemaining: number;
  unit: string;
}

export const calculateRemainingData = (metricsData: MetricData[]): RemainingItem[] => {
  return metricsData.map(metric => ({
    title: metric.title,
    remaining: metric.limit - metric.value,
    percentRemaining: 100 - metric.percentUsed,
    unit: metric.unit === "users" || metric.unit === "seats" ? "" : metric.unit // Remove "users" and "seats" units
  }));
};

export const findCardByTitle = (metricsData: MetricData[], title: string): MetricData | undefined => {
  return metricsData.find(metric => metric.title === title);
};
