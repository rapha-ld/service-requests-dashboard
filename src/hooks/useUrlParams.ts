
import { useSearchParams } from "react-router-dom";
import { ViewType, GroupingType, TimeRangeType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get values from URL params with defaults
  const getViewType = (): ViewType => 
    (searchParams.get("viewType") as ViewType) || "net-new";
  
  const getGrouping = (): GroupingType => 
    (searchParams.get("grouping") as GroupingType) || "all";
  
  const getTimeRange = (): TimeRangeType => 
    (searchParams.get("timeRange") as TimeRangeType) || "month-to-date";
  
  const getSelectedMonth = (): number => 
    parseInt(searchParams.get("month") || new Date().getMonth().toString());
  
  const getSortDirection = (): 'asc' | 'desc' => 
    (searchParams.get("sort") as 'asc' | 'desc') || "desc";
  
  const getChartType = (): ChartType => 
    (searchParams.get("chartType") as ChartType) || "bar";
  
  const getSelectedProject = (): string => 
    searchParams.get("project") || "all";
  
  const getCustomDateRange = (): DateRange => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    
    return {
      from: fromParam ? new Date(fromParam) : new Date(),
      to: toParam ? new Date(toParam) : new Date()
    };
  };
  
  // Set values to URL params
  const setViewType = (value: ViewType) => {
    searchParams.set("viewType", value);
    setSearchParams(searchParams);
  };
  
  const setGrouping = (value: GroupingType) => {
    searchParams.set("grouping", value);
    setSearchParams(searchParams);
  };
  
  const setTimeRange = (value: TimeRangeType) => {
    searchParams.set("timeRange", value);
    setSearchParams(searchParams);
  };
  
  const setSelectedMonth = (value: number) => {
    searchParams.set("month", value.toString());
    setSearchParams(searchParams);
  };
  
  const setSortDirection = (value: 'asc' | 'desc') => {
    searchParams.set("sort", value);
    setSearchParams(searchParams);
  };
  
  const setChartType = (value: ChartType) => {
    searchParams.set("chartType", value);
    setSearchParams(searchParams);
  };
  
  const setSelectedProject = (value: string) => {
    searchParams.set("project", value);
    setSearchParams(searchParams);
  };
  
  const setCustomDateRange = (dateRange: DateRange) => {
    if (dateRange.from) {
      searchParams.set("from", dateRange.from.toISOString());
    }
    if (dateRange.to) {
      searchParams.set("to", dateRange.to.toISOString());
    }
    setSearchParams(searchParams);
  };
  
  return {
    // Getters
    getViewType,
    getGrouping,
    getTimeRange,
    getSelectedMonth,
    getSortDirection,
    getChartType,
    getSelectedProject,
    getCustomDateRange,
    
    // Setters
    setViewType,
    setGrouping,
    setTimeRange,
    setSelectedMonth,
    setSortDirection,
    setChartType,
    setSelectedProject,
    setCustomDateRange
  };
}
