import { useState, useRef, useEffect } from "react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ExperimentHeader } from "@/components/experiments/ExperimentHeader";
import { useExperimentData, TimeRangeType } from "@/hooks/useExperimentData";
import { 
  processExperimentData, 
  calculateMaxValue, 
  getExperimentsTotalData,
  ExperimentGroup 
} from "@/utils/experiments";
import { DateRange } from "@/types/mauTypes";

// Experiment events threshold from Overview page
const EXPERIMENT_EVENTS_THRESHOLD = 500000;

const Experiments = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('cumulative'); 
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area'); 
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const chartRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  // Handle time range change with special behavior for 12M
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    
    // Force net-new view when 12M is selected
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
      setChartType('bar');
    }
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
  };
  
  // Handle view type change - but only if not in 12M view
  const handleViewTypeChange = (newViewType: 'net-new' | 'cumulative') => {
    if (timeRange !== 'last-12-months') {
      setViewType(newViewType);
      setChartType(newViewType === 'net-new' ? 'bar' : 'area');
    }
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
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          onTimeRangeChange={handleTimeRangeChange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={handleCustomDateRangeChange}
          showViewTypeToggle={false} // Hide in header, we'll show in chart section
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
          disableViewTypeToggle={timeRange === 'last-12-months'} // Disable toggle for 12M view
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};

export default Experiments;
