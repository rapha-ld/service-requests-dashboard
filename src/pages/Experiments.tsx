import { useState, useRef, useEffect } from "react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ExperimentHeader } from "@/components/experiments/ExperimentHeader";
import { useExperimentData } from "@/hooks/useExperimentData";
import { 
  processExperimentData, 
  calculateMaxValue, 
  getExperimentsTotalData,
  ExperimentGroup 
} from "@/utils/experiments";
import { DateRange } from "@/types/mauTypes";
import { ViewType, TimeRangeType } from "@/types/serviceData";
import { useUrlParams } from "@/hooks/useUrlParams";

// Experiment events threshold from Overview page
const EXPERIMENT_EVENTS_THRESHOLD = 500000;

const Experiments = () => {
  const urlParams = useUrlParams();
  
  const [selectedMonth, setSelectedMonth] = useState(urlParams.getSelectedMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(urlParams.getSortDirection());
  const [viewType, setViewType] = useState<ViewType>(urlParams.getViewType());
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>(urlParams.getChartType());
  const [timeRange, setTimeRange] = useState<TimeRangeType>(urlParams.getTimeRange());
  const [customDateRange, setCustomDateRange] = useState<DateRange>(urlParams.getCustomDateRange());
  
  const chartRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    if (viewType === 'net-new') {
      setChartType('bar');
      urlParams.setChartType('bar');
    } else if (viewType === 'rolling-30d') {
      setChartType('line');
      urlParams.setChartType('line');
    } else {
      setChartType('area');
      urlParams.setChartType('area');
    }
  }, [viewType]);
  
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    urlParams.setTimeRange(newTimeRange);
    
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      urlParams.setViewType('net-new');
      setChartType('bar');
      urlParams.setChartType('bar');
    }
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    urlParams.setCustomDateRange(dateRange);
  };
  
  const handleViewTypeChange = (newViewType: ViewType) => {
    if (timeRange !== 'last-12-months') {
      setViewType(newViewType);
      urlParams.setViewType(newViewType);
      
      if (newViewType === 'net-new') {
        setChartType('bar');
        urlParams.setChartType('bar');
      } else if (newViewType === 'rolling-30d') {
        setChartType('line');
        urlParams.setChartType('line');
      } else {
        setChartType('area');
        urlParams.setChartType('area');
      }
    }
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

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const { data: serviceData } = useExperimentData(
    timeRange, 
    currentDate,
    timeRange === 'custom' ? customDateRange : undefined
  );

  if (!serviceData) return null;

  const { sortedGroups } = processExperimentData(serviceData, sortDirection);
  const maxValue = calculateMaxValue(sortedGroups as ExperimentGroup[], viewType);
  const allExperimentsData = getExperimentsTotalData(serviceData, timeRange);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Experiment Keys</h1>
        
        <ExperimentHeader
          viewType={viewType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          timeRange={timeRange}
          onViewTypeChange={handleViewTypeChange}
          onSortDirectionChange={handleSortDirectionChange}
          onMonthChange={handleMonthChange}
          onTimeRangeChange={handleTimeRangeChange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
          showViewTypeToggle={false}
        />
        
        <DashboardCharts
          allEnvironmentsData={allExperimentsData}
          sortedGroups={sortedGroups as any[]}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping="environment"
          chartRefs={chartRefs}
          onExportChart={() => {}}
          unitLabel="keys"
          useViewDetailsButton={false}
          showThreshold={true}
          threshold={EXPERIMENT_EVENTS_THRESHOLD}
          onViewTypeChange={handleViewTypeChange}
          disableViewTypeToggle={timeRange === 'last-12-months'}
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};

export default Experiments;
