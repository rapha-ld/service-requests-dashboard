
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeRangeType } from "@/hooks/useMAUData";
import { ProjectSelector } from "@/components/mau/ProjectSelector";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MAUDashboardControlsProps {
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar' | 'line';
  selectedMonth: number;
  sortDirection: 'desc' | 'asc';
  timeRange: TimeRangeType;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  onChartTypeChange: (value: 'area' | 'bar' | 'line') => void;
  onSortDirectionChange: () => void;
  onMonthChange: (value: string) => void;
  onTimeRangeChange: (value: TimeRangeType) => void;
  hideModeToggle?: boolean;
}

export const MAUDashboardControls = ({
  viewType,
  chartType,
  selectedMonth,
  sortDirection,
  timeRange,
  selectedProject,
  setSelectedProject,
  onViewTypeChange,
  onChartTypeChange,
  onSortDirectionChange,
  onMonthChange,
  onTimeRangeChange,
  hideModeToggle = false
}: MAUDashboardControlsProps) => {
  // Removed the useEffect that was forcing cumulative view
  // This allows users to freely toggle between views
  
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
      <ProjectSelector 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      
      <div className="flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={timeRange === 'month-to-date' ? 'default' : 'outline'}
                onClick={() => onTimeRangeChange('month-to-date')}
                className={`rounded-r-none ${
                  timeRange === 'month-to-date' 
                    ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''
                }`}
              >
                MTD
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Month-to-date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={timeRange === 'rolling-30-day' ? 'default' : 'outline'}
                onClick={() => onTimeRangeChange('rolling-30-day')}
                className={`rounded-none border-l-0 ${
                  timeRange === 'rolling-30-day' 
                    ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''
                }`}
              >
                30D
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rolling 30-day Avg.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button
          variant={timeRange === 'last-12-months' ? 'default' : 'outline'}
          onClick={() => onTimeRangeChange('last-12-months')}
          className={`rounded-l-none border-l-0 ${
            timeRange === 'last-12-months' 
              ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
              : ''
          }`}
        >
          12M
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
      
      {/* Only show Cumulative/Net New toggle when not in Last 12 Months view and hideModeToggle is false */}
      {timeRange !== 'last-12-months' && !hideModeToggle && (
        <div className="flex">
          <Button
            variant={viewType === 'cumulative' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('cumulative')}
            className={`rounded-r-none ${
              viewType === 'cumulative' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Cumulative
          </Button>
          <Button
            variant={viewType === 'net-new' ? 'default' : 'outline'}
            onClick={() => onViewTypeChange('net-new')}
            className={`rounded-l-none border-l-0 ${
              viewType === 'net-new' 
                ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                : ''
            }`}
          >
            Net New
          </Button>
        </div>
      )}
      
      <Button
        variant="outline"
        onClick={onSortDirectionChange}
        className="h-10 ml-2"
        title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
      >
        <ArrowUpDown className="h-4 w-4 text-primary" />
        Sort
      </Button>
    </div>
  );
};
