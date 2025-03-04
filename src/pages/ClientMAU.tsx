
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

  // Use memoization to prevent unnecessary re-renders
  const projects = useMemo(() => generateProjectList(), []);

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  // Create a safe fallback data structure
  const createFallbackData = (): MAUDataResult => {
    const defaultData: EnvironmentData = generateMockMonthlyData(500, new Date());
    return {
      current: { production: defaultData },
      previous: { production: defaultData },
      currentTotals: { production: getTotalValue(defaultData) },
      previousTotals: { production: getTotalValue(defaultData) }
    };
  };

  const { data: mauData = createFallbackData() } = useQuery<MAUDataResult>({
    queryKey: ['mau-data', currentDate.toISOString(), selectedProject, timeRange],
    queryFn: () => {
      try {
        // Get data for the current project
        const current = getMockMAUData(selectedProject);
        const previous = getMockMAUData(selectedProject);

        // Handle the case for last 12 months view
        if (timeRange === 'last-12-months') {
          const last12MonthsData: EnvironmentsMap = {};
          
          // Make sure current has data
          if (current && Object.keys(current).length > 0) {
            Object.keys(current).forEach(key => {
              last12MonthsData[key] = Array.from({ length: 12 }, (_, i) => ({
                day: format(subMonths(new Date(), i), 'MMM'),
                value: Math.floor(Math.random() * 5000)
              })).reverse();
            });
          } else {
            // Fallback if no environments are found
            last12MonthsData['production'] = Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 5000)
            })).reverse();
          }

          // Calculate totals for each environment
          const currentTotals = Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          );
          
          const previousTotals = Object.fromEntries(
            Object.entries(previous || {}).map(([key, data]) => [key, getTotalValue(data)])
          );

          return {
            current: last12MonthsData,
            previous: previous || {},
            currentTotals,
            previousTotals
          };
        }

        // Calculate totals for regular month view
        const currentTotals = Object.fromEntries(
          Object.entries(current || {}).map(([key, data]) => [key, getTotalValue(data)])
        );
        
        const previousTotals = Object.fromEntries(
          Object.entries(previous || {}).map(([key, data]) => [key, getTotalValue(data)])
        );

        return {
          current: current || {},
          previous: previous || {},
          currentTotals,
          previousTotals
        };
      } catch (error) {
        console.error("Error fetching MAU data:", error);
        return createFallbackData();
      }
    },
    // Provide a fallback value if the query fails
    placeholderData: createFallbackData()
  });

  // Early return with fallback UI if no data is available
  if (!mauData || !mauData.current) {
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
          <div className="p-8 text-center">
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform the data into chart groups
  const groups: ChartGroup[] = Object.entries(mauData.current || {}).map(([id, data]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    value: mauData.currentTotals?.[id] || 0,
    data: data || [],
    percentChange: calculatePercentChange(
      mauData.currentTotals?.[id] || 0,
      mauData.previousTotals?.[id] || 0
    )
  }));

  // Sort the groups based on the selected sort direction
  const sortedGroups = groups.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  // Calculate max value for the charts
  const maxValue = viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => (env.data || []).map(d => d.value)), 0)
    : Math.max(...groups.map(env => 
        (env.data || []).reduce((sum, item) => sum + item.value, 0)
      ), 0);

  // Prepare the combined data for all environments
  let allEnvironmentsData: EnvironmentData = [];
  if (mauData.current && Object.keys(mauData.current).length > 0) {
    const firstEnvKey = Object.keys(mauData.current)[0];
    const firstEnvData = mauData.current[firstEnvKey];
    
    if (firstEnvData && firstEnvData.length > 0) {
      allEnvironmentsData = firstEnvData.map((_, index) => {
        const day = timeRange === 'last-12-months' 
          ? (firstEnvData[index]?.day || `Month ${index + 1}`)
          : (index + 1).toString();
          
        const value = Object.values(mauData.current).reduce((sum, data) => {
          if (!data || !data[index]) return sum;
          return sum + (data[index]?.value || 0);
        }, 0);
        
        return { day, value };
      });
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
