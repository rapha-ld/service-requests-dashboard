
import { ArrowUpDown, BarChart3, LineChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  grouping: 'environment' | 'relayId' | 'userAgent';
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  onGroupingChange: (value: 'environment' | 'relayId' | 'userAgent') => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onChartTypeChange: (value: 'area' | 'bar') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  timeRange: 'month-to-date' | 'last-12-months';
  onTimeRangeChange: (value: 'month-to-date' | 'last-12-months') => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DashboardHeader = ({
  grouping,
  viewType,
  chartType,
  selectedMonth,
  sortDirection,
  onGroupingChange,
  onViewTypeChange,
  onChartTypeChange,
  onSortDirectionChange,
  onMonthChange,
  timeRange,
  onTimeRangeChange,
}: DashboardHeaderProps) => {
  return (
    <div className="flex gap-2 items-center mb-6">
      <Select
        value={grouping}
        onValueChange={(value) => onGroupingChange(value as 'environment' | 'relayId' | 'userAgent')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select grouping" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="environment">Environment</SelectItem>
          <SelectItem value="relayId">Relay ID</SelectItem>
          <SelectItem value="userAgent">User Agent</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex">
        <Button
          variant={viewType === 'net-new' ? 'default' : 'outline'}
          onClick={() => onViewTypeChange('net-new')}
          className="rounded-r-none"
        >
          Net New
        </Button>
        <Button
          variant={viewType === 'cumulative' ? 'default' : 'outline'}
          onClick={() => onViewTypeChange('cumulative')}
          className="rounded-l-none border-l-0"
        >
          Cumulative
        </Button>
      </div>
      <div className="flex">
        <Button
          variant={chartType === 'area' ? 'default' : 'outline'}
          onClick={() => onChartTypeChange('area')}
          className="rounded-r-none"
        >
          <LineChart className="h-4 w-4 mr-2" />
          Area
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          onClick={() => onChartTypeChange('bar')}
          className="rounded-l-none border-l-0"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Bar
        </Button>
      </div>
      <Button
        variant="outline"
        onClick={onSortDirectionChange}
        className="h-10"
        title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
      >
        <ArrowUpDown className="h-4 w-4 text-primary" />
        Sort
      </Button>
      <div className="flex">
        <Button
          variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('month-to-date')}
          className="rounded-r-none"
        >
          Month-to-date
        </Button>
        <Button
          variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('last-12-months')}
          className="rounded-l-none border-l-0"
        >
          Last 12 Months
        </Button>
      </div>
      {timeRange === 'month-to-date' && (
        <Select
          value={selectedMonth.toString()}
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month} {new Date().getFullYear()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex-grow" />
      <ThemeToggle />
    </div>
  );
};

