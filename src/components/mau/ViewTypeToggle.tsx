
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart, AreaChart } from "lucide-react";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative' | 'rolling-30d';
  onViewTypeChange: (value: 'net-new' | 'cumulative' | 'rolling-30d') => void;
}

export const ViewTypeToggle = ({
  viewType,
  onViewTypeChange
}: ViewTypeToggleProps) => {
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
          tooltip: "30-day rolling unique count, reported daily"
        }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative' | 'rolling-30d')}
    />
  );
};
