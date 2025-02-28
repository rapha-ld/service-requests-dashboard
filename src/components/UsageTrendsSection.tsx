
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
  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-left">Usage Trends</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SmallMultiple
          title="Client MAU"
          data={chartData.clientMAU}
          color="#394497"
          unit=" users"
          viewType="cumulative"
          maxValue={metricsInfo.clientMAU.limit}
          chartType="area"
          showThreshold={true}
        />
        <SmallMultiple
          title="Experiment Events"
          data={chartData.experimentEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={metricsInfo.experimentEvents.limit}
          chartType="area"
          showThreshold={true}
        />
        <SmallMultiple
          title="Data Export Events"
          data={chartData.dataExportEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={metricsInfo.dataExportEvents.limit}
          chartType="area"
          showThreshold={true}
        />
      </div>
    </>
  );
};
