
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart, AreaChart } from "lucide-react";
import { TimeRangeType } from "@/types/mauTypes";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  onViewTypeChange: (value: 'net-new' | 'cumulative' | 'rolling-30d') => void;
  visible?: boolean;
  timeRange?: TimeRangeType; // Add timeRange prop
}

export const ViewTypeToggle = ({
  viewType,
  onViewTypeChange,
  visible = true,
  timeRange
}: ViewTypeToggleProps) => {
  // Determine if rolling-30d should be disabled based on the timeRange
  const isRolling30dDisabled = timeRange === '3-day';

  if (!visible) return null;

  return (
    <Toggle
      options={[
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
          noRoundedRight: true
        },
        { 
          value: 'rolling-30d', 
          label: 'Rolling 30D',
          icon: <LineChart className="h-4 w-4 mr-1" />,
          tooltip: "30-day rolling unique count, reported daily",
          disabled: isRolling30dDisabled // Disable this option when timeRange is '3-day'
        }
      ]}
      value={viewType}
      onChange={(value) => {
        // Prevent selecting rolling-30d when it's disabled
        if (value === 'rolling-30d' && isRolling30dDisabled) return;
        onViewTypeChange(value as 'net-new' | 'cumulative' | 'rolling-30d');
      }}
    />
  );
};
