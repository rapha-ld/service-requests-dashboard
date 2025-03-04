
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { getTotalValue, calculatePercentChange } from "@/utils/dataTransformers";
import { format, subMonths } from "date-fns";
import { SearchableSelect } from "@/components/SearchableSelect";
import { getMockMAUData, generateProjectList } from "@/utils/mauDataGenerator";

type TimeRangeType = 'month-to-date' | 'last-12-months';

const ClientMAU = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const chartRefs = useRef<{ [key: string]: any }>({});

  const projects = generateProjectList();

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: mauData } = useQuery({
    queryKey: ['mau-data', currentDate.toISOString(), selectedProject, timeRange],
    queryFn: () => {
      const current = getMockMAUData(selectedProject);
      const previous = getMockMAUData(selectedProject);

      // Transform data for last 12 months
      if (timeRange === 'last-12-months') {
        const last12MonthsData = Object.fromEntries(
          Object.entries(current).map(([key, data]) => [
            key,
            Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 5000)
            })).reverse()
          ])
        );
        return {
          current: last12MonthsData,
          previous,
          currentTotals: Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }

      return {
        current,
        previous,
        currentTotals: Object.fromEntries(
          Object.entries(current).map(([key, data]) => [key, getTotalValue(data)])
        ),
        previousTotals: Object.fromEntries(
          Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
        )
      };
    }
  });

  if (!mauData) return null;

  const groups = Object.entries(mauData.current).map(([id, data]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    value: mauData.currentTotals[id],
    data,
    percentChange: calculatePercentChange(
      mauData.currentTotals[id],
      mauData.previousTotals[id]
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

  const allEnvironmentsData = Object.values(mauData.current)[0].map((_, index) => ({
    day: timeRange === 'last-12-months' 
      ? Object.values(mauData.current)[0][index].day
      : (index + 1).toString(),
    value: Object.values(mauData.current).reduce((sum, data) => sum + data[index].value, 0)
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Client MAU</h1>
        
        <div className="mb-6">
          <SearchableSelect 
            items={projects}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Select project"
          />
        </div>
        
        <DashboardHeader
          grouping="environment"
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={() => {}}
          onViewTypeChange={setViewType}
          onChartTypeChange={setChartType}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          showGrouping={false}
        />
        
        <DashboardSummary groups={sortedGroups} />
        
        <DashboardCharts
          allEnvironmentsData={allEnvironmentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping="environment"
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          unitLabel="users"
        />
      </div>
    </div>
  );
};

export default ClientMAU;
