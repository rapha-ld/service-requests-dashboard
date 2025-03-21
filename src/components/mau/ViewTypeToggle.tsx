
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart, Calendar } from "lucide-react";

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
          icon: <LineChart className="h-4 w-4 mr-1" />,
          tooltip: "Counting resets monthly"
        },
        { 
          value: 'net-new', 
          label: 'Incremental',
          icon: <BarChart className="h-4 w-4 mr-1" />,
          tooltip: "Unique counting resets monthly"
        },
        { 
          value: 'rolling-30d', 
          label: 'Rolling 30D',
          icon: <Calendar className="h-4 w-4 mr-1" />,
          tooltip: "Unique count from preceding 30 days"
        }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative' | 'rolling-30d')}
    />
  );
};
