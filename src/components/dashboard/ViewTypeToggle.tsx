
import { Toggle } from "@/components/common/Toggle";
import { BarChart, LineChart } from "lucide-react";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  visible: boolean;
}

export const ViewTypeToggle = ({ viewType, onViewTypeChange, visible }: ViewTypeToggleProps) => {
  if (!visible) return null;

  return (
    <Toggle
      options={[
        { 
          value: 'cumulative', 
          label: 'Cumulative',
          icon: <LineChart className="h-4 w-4 mr-1" />
        },
        { 
          value: 'net-new', 
          label: 'Incremental',
          icon: <BarChart className="h-4 w-4 mr-1" />
        }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative')}
    />
  );
};
