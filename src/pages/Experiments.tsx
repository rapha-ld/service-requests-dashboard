
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { getMockData } from "@/utils/mockDataGenerator";
import { getTotalValue, calculatePercentChange } from "@/utils/dataTransformers";
import { format, subMonths } from "date-fns";

type TimeRangeType = 'month-to-date' | 'last-12-months';

const Experiments = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const chartRefs = useRef<{ [key: string]: any }>({});

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: serviceData } = useQuery({
    queryKey: ['experiment-data', currentDate.toISOString(), timeRange],
    queryFn: () => {
      const current = getMockData('environment'); // Using environment as base but we'll rename the keys
      const previous = getMockData('environment');

      // Rename keys to experiment names
      const experimentNames = [
        'UserSegmentation', 'FeatureToggle', 'ABTesting', 
        'MultiVariant', 'Personalization', 'Targeting', 
        'ReleaseGating', 'CanaryRelease', 'BlueGreenDeploy'
      ];
      
      // Create new objects with experiment names as keys
      const currentExperiments: Record<string, any> = {};
      const previousExperiments: Record<string, any> = {};
      
      Object.values(current).forEach((data, index) => {
        if (index < experimentNames.length) {
          currentExperiments[experimentNames[index]] = data;
        }
      });
      
      Object.values(previous).forEach((data, index) => {
        if (index < experimentNames.length) {
          previousExperiments[experimentNames[index]] = data;
        }
      });

      // Transform data for last 12 months
      if (timeRange === 'last-12-months') {
        const last12MonthsData = Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [
            key,
            Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 1000)
            })).reverse()
          ])
        );
        
        return {
          current: last12MonthsData,
          previous: previousExperiments,
          currentTotals: Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }

      return {
        current: currentExperiments,
        previous: previousExperiments,
        currentTotals: Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [key, getTotalValue(data)])
        ),
        previousTotals: Object.fromEntries(
          Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
        )
      };
    }
  });

  if (!serviceData) return null;

  const groups = Object.entries(serviceData.current).map(([id, data]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1').trim(),
    value: serviceData.currentTotals[id],
    data,
    percentChange: calculatePercentChange(
      serviceData.currentTotals[id],
      serviceData.previousTotals[id]
    )
  }));

  const sortedGroups = groups.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  const maxValue = viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));

  const allExperimentsData = Object.values(serviceData.current)[0].map((_, index) => ({
    day: timeRange === 'last-12-months' 
      ? Object.values(serviceData.current)[0][index].day
      : (index + 1).toString(),
    value: Object.values(serviceData.current).reduce((sum, data) => sum + data[index].value, 0)
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Experiments</h1>
        
        <DashboardHeader
          grouping="environment" 
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={() => {}} // Not used in Experiments
          onViewTypeChange={setViewType}
          onChartTypeChange={setChartType}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          showGrouping={false} // Hide the grouping dropdown
        />
        
        <DashboardSummary groups={sortedGroups} />
        
        <DashboardCharts
          allEnvironmentsData={allExperimentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping="environment" // We need to pass this but it won't be used visibly
          chartRefs={chartRefs}
          onExportChart={() => {}}
          unitLabel="keys" // Change unit from "reqs" to "keys"
          useViewDetailsButton={true}
        />
      </div>
    </div>
  );
};

export default Experiments;
