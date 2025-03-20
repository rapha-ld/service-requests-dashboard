
import React from "react";
import { SmallMultiple } from "@/components/SmallMultiple";

interface ChartData {
  clientMAU: Array<{ day: string; value: number | null }>;
  experimentEvents: Array<{ day: string; value: number | null }>;
  dataExportEvents: Array<{ day: string; value: number | null }>;
}

interface MetricInfo {
  title: string;
  limit: number;
}

interface UsageTrendsSectionProps {
  chartData: ChartData;
  metricsInfo: {
    clientMAU: MetricInfo;
    experimentEvents: MetricInfo;
    dataExportEvents: MetricInfo;
  };
}

export const UsageTrendsSection: React.FC<UsageTrendsSectionProps> = ({ chartData, metricsInfo }) => {
  // Calculate the maximum limit across all metrics for consistent y-axis scaling
  const maxLimit = Math.max(
    metricsInfo.clientMAU.limit,
    metricsInfo.experimentEvents.limit,
    metricsInfo.dataExportEvents.limit
  );

  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground mb-9 text-left">Cumulative Monthly Usage</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SmallMultiple
          title="Client MAU"
          data={chartData.clientMAU}
          color="#394497"
          unit=" users"
          viewType="cumulative"
          maxValue={maxLimit}
          chartType="area"
          showThreshold={true}
          threshold={metricsInfo.clientMAU.limit}
          className="mb-12"
        />
        <SmallMultiple
          title="Experiment Events"
          data={chartData.experimentEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={maxLimit}
          chartType="area"
          showThreshold={true}
          threshold={metricsInfo.experimentEvents.limit}
          className="mb-12"
        />
        <SmallMultiple
          title="Data Export Events"
          data={chartData.dataExportEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={maxLimit}
          chartType="area"
          showThreshold={true}
          threshold={metricsInfo.dataExportEvents.limit}
          className="mb-12"
        />
      </div>
    </>
  );
};
