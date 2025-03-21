
import { useSearchParams } from "react-router-dom";
import { ViewType, GroupingType, TimeRangeType, ChartType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get values from URL params with defaults
  const getViewType = (): ViewType => {
    const viewType = searchParams.get("viewType") as ViewType;
    // Validate that the viewType is one of the allowed values
    if (["net-new", "cumulative", "rolling-30d"].includes(viewType)) {
      return viewType;
    }
    return "net-new"; // default
  };
  
  const getGrouping = (): GroupingType => {
    const grouping = searchParams.get("grouping") as GroupingType;
    if (["all", "environment", "relayId", "userAgent"].includes(grouping)) {
      return grouping;
    }
    return "all"; // default
  };
  
  const getTimeRange = (): TimeRangeType => {
    const timeRange = searchParams.get("timeRange") as TimeRangeType;
    if (["3-day", "7-day", "rolling-30-day", "month-to-date", "last-12-months", "custom"].includes(timeRange)) {
      return timeRange;
    }
    return "month-to-date"; // default
  };
  
  const getSelectedMonth = (): number => {
    const monthParam = searchParams.get("month");
    if (monthParam && !isNaN(parseInt(monthParam))) {
      return parseInt(monthParam);
    }
    return new Date().getMonth(); // default to current month
  };
  
  const getSortDirection = (): 'asc' | 'desc' => {
    const sort = searchParams.get("sort") as 'asc' | 'desc';
    if (["asc", "desc"].includes(sort)) {
      return sort;
    }
    return "desc"; // default
  };
  
  const getChartType = (): ChartType => {
    const chartType = searchParams.get("chartType") as ChartType;
    if (["bar", "area", "line"].includes(chartType)) {
      return chartType;
    }
    return "bar"; // default
  };
  
  const getSelectedProject = (): string => 
    searchParams.get("project") || "all";
  
  const getCustomDateRange = (): DateRange => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return {
      from: fromParam ? new Date(fromParam) : thirtyDaysAgo,
      to: toParam ? new Date(toParam) : today
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
