
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
    
    // Transform each dataset to get cumulative values with consistent handling of resets
    const cumulativeMaxValues = datasets.map(data => {
      // Use same transformation logic for all datasets (handleResets=true, isDiagnosticPage=false)
      const transformedData = transformData(data, 'cumulative', true, false);
      return Math.max(...transformedData.map(d => d.value !== null ? d.value : 0), 0);
    });
    
    // Get limits for each metric
    const limits = [
      metricsInfo.clientMAU.limit,
      metricsInfo.experimentEvents.limit,
      metricsInfo.dataExportEvents.limit
    ];
    
    // Find the highest value among all charts and limits, then add a 10% margin
    const highestValue = Math.max(...cumulativeMaxValues, ...limits, 0);
    return highestValue * 1.1;
  };
  
  // Get shared maximum value for consistent y-axis scaling
  const sharedMaxValue = calculateSharedMaxValue();
  
  // Transform data for each chart
  const transformedClientMAU = transformData(chartData.clientMAU, 'cumulative', true, false);
  const transformedExperimentEvents = transformData(chartData.experimentEvents, 'cumulative', true, false);
  const transformedDataExportEvents = transformData(chartData.dataExportEvents, 'cumulative', true, false);
  
  // Only show thresholds in cumulative view (which is the only view used in this component)
  const viewType = 'cumulative';
  const showThreshold = true;
  
  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground mb-9 text-left">Cumulative Monthly Usage</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SmallMultiple
          title="Client MAU"
          data={transformedClientMAU}
          color="#394497"
          unit=" users"
          viewType="cumulative"
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={showThreshold}
          threshold={metricsInfo.clientMAU.limit}
          className="mb-12"
        />
        <SmallMultiple
          title="Experiment Events"
          data={transformedExperimentEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={showThreshold}
          threshold={metricsInfo.experimentEvents.limit}
          className="mb-12"
        />
        <SmallMultiple
          title="Data Export Events"
          data={transformedDataExportEvents}
          color="#394497"
          unit=""
          viewType="cumulative"
          maxValue={sharedMaxValue}
          chartType="area"
          showThreshold={showThreshold}
          threshold={metricsInfo.dataExportEvents.limit}
          className="mb-12"
        />
      </div>
    </>
  );
};
