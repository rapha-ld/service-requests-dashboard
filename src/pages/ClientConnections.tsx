import { useState, useRef, useEffect } from "react";
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
import { DateRange } from "@/types/mauTypes";
import { useUrlParams } from "@/hooks/useUrlParams";

const ClientConnections = () => {
  const urlParams = useUrlParams();
  
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>(
    urlParams.getViewType() === 'rolling-30d' ? 'cumulative' : urlParams.getViewType() as 'net-new' | 'cumulative'
  );
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>(urlParams.getChartType());
  const [timeRange, setTimeRange] = useState<TimeRangeType>(urlParams.getTimeRange());
  const [selectedProject, setSelectedProject] = useState<string>(urlParams.getSelectedProject());
  const [customDateRange, setCustomDateRange] = useState<DateRange>(urlParams.getCustomDateRange());
  
  const chartRefs = useRef<{ [key: string]: any }>({});

  const connectionMultiplier = 4;

  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
    urlParams.setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  const handleViewTypeChange = (newViewType: 'net-new' | 'cumulative') => {
    setViewType(newViewType);
    urlParams.setViewType(newViewType);
    
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
    urlParams.setChartType(newViewType === 'net-new' ? 'bar' : 'area');
  };
  
  const handleChartTypeChange = (newChartType: 'area' | 'bar' | 'line') => {
    setChartType(newChartType);
    urlParams.setChartType(newChartType);
  };
  
  const handleSortDirectionChange = () => {
    const newSortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newSortDirection);
    urlParams.setSortDirection(newSortDirection);
  };
  
  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setSelectedMonth(newMonth);
    urlParams.setSelectedMonth(newMonth);
  };
  
  const safeSetSelectedProject = (project: string) => {
    try {
      setSelectedProject(project || "all");
      urlParams.setSelectedProject(project || "all");
    } catch (error) {
      console.error("Error setting project:", error);
      setSelectedProject("all");
      urlParams.setSelectedProject("all");
    }
  };

  const { mauData, isLoading } = useMAUData(selectedMonth, selectedProject, timeRange, 
    timeRange === 'custom' ? customDateRange : undefined);

  if (isLoading) {
    return (
      <LoadingState 
        selectedProject={selectedProject} 
        setSelectedProject={safeSetSelectedProject} 
      />
    );
  }

  const safeData = mauData;
  const safeCurrent = safeData?.current || {};
  const safeCurrentTotals = safeData?.currentTotals || {};
  const safePreviousTotals = safeData?.previousTotals || {};

  const baseGroups = transformDataToChartGroups(safeCurrent, safeCurrentTotals, safePreviousTotals);
  
  const groups = baseGroups.map(group => ({
    ...group,
    data: group.data.map(item => ({
      ...item,
      value: Math.floor(item.value * connectionMultiplier)
    })),
    value: Math.floor(group.value * connectionMultiplier)
  }));
  
  const sortedGroups = [...groups].sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  const maxValue = calculateMaxValue(sortedGroups, viewType);
  
  let allEnvironmentsData = getLast12MonthsData(safeCurrent, timeRange).map(item => ({
    day: item.day,
    value: Math.floor(item.value * connectionMultiplier)
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Client Connections" />
        
        <MAUDashboardControls
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          timeRange={timeRange}
          selectedProject={selectedProject}
          setSelectedProject={safeSetSelectedProject}
          onViewTypeChange={handleViewTypeChange}
          onChartTypeChange={handleChartTypeChange}
          onSortDirectionChange={handleSortDirectionChange}
          onMonthChange={handleMonthChange}
          onTimeRangeChange={handleTimeRangeChange}
          hideModeToggle={true}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
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
          showOnlyTotal={false}
          unitLabel="connections"
          showThreshold={false}
          threshold={undefined}
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={false}
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};

export default ClientConnections;
