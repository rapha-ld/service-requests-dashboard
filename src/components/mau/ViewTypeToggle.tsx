
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart, AreaChart } from "lucide-react";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  onViewTypeChange: (value: 'net-new' | 'cumulative' | 'rolling-30d') => void;
  timeRange?: string;
  isCustomDateRangeShort?: boolean;
  visible?: boolean;
}

export const ViewTypeToggle = ({
  viewType,
  onViewTypeChange,
  timeRange,
  isCustomDateRangeShort = false,
  visible = true
}: ViewTypeToggleProps) => {
  if (!visible) return null;

  // Determine if we should show the Rolling 30D option
  // Hide it for 3-day view or short custom date ranges (≤ 3 days)
  const shouldHideRolling30D = timeRange === '3-day' || isCustomDateRangeShort;

  const options = [
    { 
      value: 'cumulative', 
      label: 'Cumulative',
      icon: <AreaChart className="h-4 w-4 mr-1" />,
      tooltip: "Counting resets monthly"
    },
    { 
      value: 'net-new', 
      label: 'Incremental',
      icon: <BarChart className="h-4 w-4 mr-1" />,
      tooltip: "Unique counting resets monthly",
      noRoundedRight: !shouldHideRolling30D
    }
  ];

  // Only show Rolling 30D option if not in a short timeframe view
  if (!shouldHideRolling30D) {
    options.push({ 
      value: 'rolling-30d', 
      label: 'Rolling 30D',
      icon: <LineChart className="h-4 w-4 mr-1" />,
      tooltip: "30-day rolling unique count, reported daily"
    });
  }

  return (
    <Toggle
      options={options}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative' | 'rolling-30d')}
    />
  );
};
