
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart } from "lucide-react";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
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
          icon: <LineChart className="h-4 w-4 mr-1" />,
          tooltip: "Counting resets monthly"
        },
        { 
          value: 'net-new', 
          label: 'Incremental',
          icon: <BarChart className="h-4 w-4 mr-1" />,
          tooltip: "Unique counting resets monthly"
        }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative')}
    />
  );
};
