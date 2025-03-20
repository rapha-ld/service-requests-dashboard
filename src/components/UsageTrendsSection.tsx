
import React from "react";
import { SmallMultiple } from "@/components/SmallMultiple";
import { transformData } from "@/components/charts/dataTransformers";

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
  // Calculate maximum cumulative value for all datasets to ensure consistent y-axis scale
  const calculateSharedMaxValue = () => {
    const datasets = [
      chartData.clientMAU,
      chartData.experimentEvents,
      chartData.dataExportEvents
    ];
    
    // Transform each dataset to get cumulative values
    const cumulativeMaxValues = datasets.map(data => {
      const transformedData = transformData(data, 'cumulative', true);
      return Math.max(...transformedData.map(d => d.value !== null ? d.value : 0), 0);
    });
    
    // Get limits for each metric
    const limits = [
      metricsInfo.clientMAU.limit,
      metricsInfo.experimentEvents.limit,
      metricsInfo.dataExportEvents.limit
    ];
    
    // Return the highest value among all charts and limits
    return Math.max(...cumulativeMaxValues, ...limits, 0);
  };
  
  // Get shared maximum value for consistent y-axis scaling
  const sharedMaxValue = calculateSharedMaxValue();
  
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
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={true}
          className="mb-12"
        />
        <SmallMultiple
          title="Experiment Events"
          data={chartData.experimentEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={true}
          className="mb-12"
        />
        <SmallMultiple
          title="Data Export Events"
          data={chartData.dataExportEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={true}
          className="mb-12"
        />
      </div>
    </>
  );
};
