
import React from "react";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";

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
  metricsData: Array<{
    title: string;
    value: number;
    unit: string;
    limit: number;
    percentUsed: number;
    status: 'good' | 'moderate' | 'poor';
    action?: React.ReactNode;
  }>;
}

export const UsageTrendsSection: React.FC<UsageTrendsSectionProps> = ({ 
  chartData, 
  metricsInfo,
  metricsData
}) => {
  // Find metrics by title
  const findMetricByTitle = (title: string) => {
    return metricsData.find(metric => metric.title === title);
  };

  const clientMAUMetric = findMetricByTitle("Client MAU");
  const experimentEventsMetric = findMetricByTitle("Experiment Events");
  const dataExportEventsMetric = findMetricByTitle("Data Export Events");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        {clientMAUMetric && (
          <SummaryCard
            title={clientMAUMetric.title}
            value={clientMAUMetric.value}
            unit={clientMAUMetric.unit}
            status={clientMAUMetric.status}
            limit={clientMAUMetric.limit}
            percentUsed={clientMAUMetric.percentUsed}
            action={clientMAUMetric.action}
            className="mb-4"
          />
        )}
        <SmallMultiple
          title="Client MAU"
          data={chartData.clientMAU}
          color="#394497"
          unit=" users"
          viewType="cumulative"
          maxValue={metricsInfo.clientMAU.limit}
          chartType="area"
          showThreshold={true}
          hideTitle={true}
        />
      </div>
      
      <div className="flex flex-col">
        {experimentEventsMetric && (
          <SummaryCard
            title={experimentEventsMetric.title}
            value={experimentEventsMetric.value}
            unit={experimentEventsMetric.unit}
            status={experimentEventsMetric.status}
            limit={experimentEventsMetric.limit}
            percentUsed={experimentEventsMetric.percentUsed}
            action={experimentEventsMetric.action}
            className="mb-4"
          />
        )}
        <SmallMultiple
          title="Experiment Events"
          data={chartData.experimentEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={metricsInfo.experimentEvents.limit}
          chartType="area"
          showThreshold={true}
          hideTitle={true}
        />
      </div>
      
      <div className="flex flex-col">
        {dataExportEventsMetric && (
          <SummaryCard
            title={dataExportEventsMetric.title}
            value={dataExportEventsMetric.value}
            unit={dataExportEventsMetric.unit}
            status={dataExportEventsMetric.status}
            limit={dataExportEventsMetric.limit}
            percentUsed={dataExportEventsMetric.percentUsed}
            action={dataExportEventsMetric.action}
            className="mb-4"
          />
        )}
        <SmallMultiple
          title="Data Export Events"
          data={chartData.dataExportEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={metricsInfo.dataExportEvents.limit}
          chartType="area"
          showThreshold={true}
          hideTitle={true}
        />
      </div>
    </div>
  );
};
