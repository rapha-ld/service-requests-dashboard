
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
} from "@/utils/experimentDataUtils";
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

  // Effect to set view type based on time range, but only for last-12-months
  useEffect(() => {
    if (timeRange === 'last-12-months') {
      setViewType('net-new');
    }
  }, [timeRange]);
  
  useEffect(() => {
    setChartType(viewType === 'net-new' ? 'bar' : 'area');
  }, [viewType]);
  
  const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
    setTimeRange(newTimeRange);
    if (newTimeRange === 'last-12-months') {
      setViewType('net-new');
    } else if (newTimeRange !== timeRange) {
      // Only set to cumulative when changing from a different time range
      setViewType('cumulative');
    }
  };
  
  const handleCustomDateRangeChange = (dateRange: DateRange) => {
    setCustomDateRange(dateRange);
  };
  
  const handleViewTypeChange = (newViewType: 'net-new' | 'cumulative') => {
    setViewType(newViewType);
    setChartType(newViewType === 'net-new' ? 'bar' : 'area');
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
        />
        
        <DashboardSummary groups={sortedGroups as ExperimentGroup[]} />
        
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
        />
      </div>
    </div>
  );
};

export default Experiments;
