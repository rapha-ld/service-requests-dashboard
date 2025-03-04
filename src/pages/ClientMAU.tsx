import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { getTotalValue, calculatePercentChange } from "@/utils/dataTransformers";
import { format, subMonths } from "date-fns";
import { SearchableSelect } from "@/components/SearchableSelect";
import { getMockMAUData, generateProjectList } from "@/utils/mauDataGenerator";
import { generateMockMonthlyData } from "@/utils/mockDataGenerator";

type TimeRangeType = 'month-to-date' | 'last-12-months';
type EnvironmentData = Array<{ day: string; value: number }>;
type EnvironmentsMap = Record<string, EnvironmentData>;

type MAUDataResult = {
  current: EnvironmentsMap;
  previous: EnvironmentsMap;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
};

interface ChartGroup {
  id: string;
  title: string;
  data: EnvironmentData;
  value: number;
  percentChange: number;
}

const ClientMAU = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const chartRefs = useRef<{ [key: string]: any }>({});

  const projects = useMemo(() => generateProjectList(), []);

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: mauData } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), selectedProject, timeRange],
    queryFn: () => {
      try {
        const current = getMockMAUData(selectedProject);
        const previous = getMockMAUData(selectedProject);

        if (timeRange === 'last-12-months') {
          const last12MonthsData: EnvironmentsMap = {};
          
          if (current && Object.keys(current).length > 0) {
            Object.keys(current).forEach(key => {
              last12MonthsData[key] = Array.from({ length: 12 }, (_, i) => ({
                day: format(subMonths(new Date(), i), 'MMM'),
                value: Math.floor(Math.random() * 5000)
              })).reverse();
            });
          } else {
            last12MonthsData['production'] = Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 5000)
            })).reverse();
          }

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
      } catch (error) {
        console.error("Error fetching MAU data:", error);
        const defaultData: EnvironmentsMap = {
          production: generateMockMonthlyData(500, new Date())
        };
        
        return {
          current: defaultData,
          previous: defaultData,
          currentTotals: { production: getTotalValue(defaultData.production) },
          previousTotals: { production: getTotalValue(defaultData.production) }
        };
      }
    }
  });

  if (!mauData) return null;

  const groups: ChartGroup[] = Object.entries(mauData.current).map(([id, data]) => ({
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

  let allEnvironmentsData: EnvironmentData = [];
  if (mauData.current && Object.values(mauData.current).length > 0) {
    const firstEnvData = Object.values(mauData.current)[0];
    if (firstEnvData && firstEnvData.length > 0) {
      allEnvironmentsData = firstEnvData.map((_, index) => ({
        day: timeRange === 'last-12-months' 
          ? (firstEnvData[index]?.day || `Month ${index + 1}`)
          : (index + 1).toString(),
        value: Object.values(mauData.current).reduce((sum, data) => 
          sum + (data[index]?.value || 0), 0)
      }));
    }
  }

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
