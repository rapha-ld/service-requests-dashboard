
import { useState, useRef } from "react";
import { MAUHeader } from "@/components/mau/MAUHeader";
import { MAUDashboardControls } from "@/components/mau/MAUDashboardControls";
import { LoadingState } from "@/components/mau/LoadingState";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useMAUData, TimeRangeType } from "@/hooks/useMAUData";
import { 
  transformDataToChartGroups, 
  getLast12MonthsData, 
  calculateMaxValue
} from "@/utils/mauDataTransformers";

const ClientMAU = () => {
  // State management
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [dataType, setDataType] = useState<'mau' | 'connections'>('mau');
  const chartRefs = useRef<{ [key: string]: any }>({});

  // Monthly user limit - same as in Overview
  const USER_LIMIT = 25000;
  
  // Error handling wrapper for state setters
  const safeSetSelectedProject = (project: string) => {
    try {
      setSelectedProject(project || "all");
    } catch (error) {
      console.error("Error setting project:", error);
      setSelectedProject("all");
    }
  };

  // Fetch MAU data with the custom hook
  const { mauData, isLoading } = useMAUData(selectedMonth, selectedProject, timeRange);

  // Handle loading state
  if (isLoading) {
    return (
      <LoadingState 
        selectedProject={selectedProject} 
        setSelectedProject={safeSetSelectedProject} 
      />
    );
  }

  // Ensure we have valid data to work with
  const safeData = mauData;
  const safeCurrent = safeData?.current || {};
  const safeCurrentTotals = safeData?.currentTotals || {};
  const safePreviousTotals = safeData?.previousTotals || {};

  // Transform the data into chart groups
  const groups = transformDataToChartGroups(safeCurrent, safeCurrentTotals, safePreviousTotals);

  // Sort the groups
  const sortedGroups = [...groups].sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  // Calculate max value for the charts
  const maxValue = calculateMaxValue(groups, viewType);
  
  // Determine if we should show the threshold based on project selection
  const showThreshold = selectedProject === "all";

  // Prepare the combined data for all environments
  const allEnvironmentsData = getLast12MonthsData(safeCurrent, timeRange);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Client" />
        
        <MAUDashboardControls
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          timeRange={timeRange}
          selectedProject={selectedProject}
          dataType={dataType}
          setSelectedProject={safeSetSelectedProject}
          onViewTypeChange={setViewType}
          onChartTypeChange={setChartType}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          onTimeRangeChange={setTimeRange}
          onDataTypeChange={setDataType}
        />
        
        <DashboardSummary groups={sortedGroups} />
        
        <DashboardCharts
          allEnvironmentsData={allEnvironmentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={Math.max(maxValue, USER_LIMIT)}
          grouping="environment"
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          unitLabel={dataType === 'mau' ? "users" : "connections"}
          showThreshold={showThreshold}
          threshold={USER_LIMIT}
        />
      </div>
    </div>
  );
};

export default ClientMAU;
