
import { Toggle } from "@/components/common/Toggle";

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
        { value: 'cumulative', label: 'Cumulative' },
        { value: 'net-new', label: 'Net New' }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative')}
    />
  );
};
