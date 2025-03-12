
import { ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DashboardHeaderProps {
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  viewType: 'net-new' | 'cumulative';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  onGroupingChange: (value: 'all' | 'environment' | 'relayId' | 'userAgent') => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  timeRange: 'month-to-date' | 'last-12-months' | 'rolling-30-day';
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months' | 'rolling-30-day') => void;
  showGrouping?: boolean;
  showViewTypeToggle?: boolean; // New prop to control visibility of view type toggle
}

export const DashboardHeader = ({
  grouping,
  viewType,
  selectedMonth,
  sortDirection,
  onGroupingChange,
  onViewTypeChange,
  onSortDirectionChange,
  onMonthChange,
  timeRange,
  onTimeRangeChange,
  showGrouping = true,
  showViewTypeToggle = true, // Default to showing the toggle
}: DashboardHeaderProps) => {
  // Generate abbreviated month options with year
  const getMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i);
      return {
        value: i.toString(),
        label: format(date, "MMM ''yy") // Format as "Jan '24"
      };
    });
  };

  const monthOptions = getMonthOptions();

  return (
    <div className="flex gap-2 items-center mb-6 flex-wrap">
      {showGrouping && (
        <Select
          value={grouping}
          onValueChange={(value) => onGroupingChange(value as 'all' | 'environment' | 'relayId' | 'userAgent')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dimensions</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="relayId">Relay ID</SelectItem>
            <SelectItem value="userAgent">User Agent</SelectItem>
          </SelectContent>
        </Select>
      )}
      
      <div className="flex">
        <Button
          variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('month-to-date')}
          className={`rounded-r-none ${
            timeRange === 'month-to-date' 
              ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
              : ''
          }`}
        >
          Month-to-date
        </Button>
        <Button
          variant={timeRange === 'rolling-30-day' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('rolling-30-day')}
          className={`rounded-none border-l-0 ${
            timeRange === 'rolling-30-day' 
              ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
              : ''
          }`}
        >
          Rolling 30 Day
        </Button>
        <Button
          variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('last-12-months')}
          className={`rounded-l-none border-l-0 ${
            timeRange === 'last-12-months' 
              ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
              : ''
          }`}
        >
          Last 12 Months
        </Button>
      </div>
      
      {timeRange === 'month-to-date' && (
        <Select
          value={selectedMonth.toString()}
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <div className="flex-grow" />
      
      {/* Only show Net New/Cumulative toggle when not in Last 12 Months view and showViewTypeToggle is true */}
      {timeRange !== 'last-12-months' && showViewTypeToggle && (
        <div className="flex">
          <Button
            variant={viewType === 'net-new' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('net-new')}
            className={`rounded-r-none ${
              viewType === 'net-new' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Net New
          </Button>
          <Button
            variant={viewType === 'cumulative' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('cumulative')}
            className={`rounded-l-none border-l-0 ${
              viewType === 'cumulative' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Cumulative
          </Button>
        </div>
      )}
      
      {/* Only show sort button when not "All dimensions" */}
      {grouping !== 'all' && (
        <Button
          variant="outline"
          onClick={onSortDirectionChange}
          className="h-10 ml-2"
          title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
        >
          <ArrowUpDown className="h-4 w-4 text-primary" />
          Sort
        </Button>
      )}
    </div>
  );
};
