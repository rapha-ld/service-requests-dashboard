
import { Toggle } from "@/components/common/Toggle";

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
        { value: 'cumulative', label: 'Cumulative' },
        { value: 'net-new', label: 'Net New' }
      ]}
      value={viewType}
      onChange={(value) => onViewTypeChange(value as 'net-new' | 'cumulative')}
    />
  );
};
