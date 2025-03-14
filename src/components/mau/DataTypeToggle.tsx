
import { Toggle } from "@/components/common/Toggle";

interface DataTypeToggleProps {
  dataType: 'mau' | 'connections';
  onDataTypeChange: (value: 'mau' | 'connections') => void;
}

export const DataTypeToggle = ({ 
  dataType, 
  onDataTypeChange 
}: DataTypeToggleProps) => {
  return (
    <Toggle
      options={[
        { value: 'mau', label: 'MAU' },
        { value: 'connections', label: 'Connections' }
      ]}
      value={dataType}
      onChange={(value) => onDataTypeChange(value as 'mau' | 'connections')}
    />
  );
};
