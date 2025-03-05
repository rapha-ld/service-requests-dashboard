
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DataTypeToggleProps {
  dataType: 'mau' | 'connections';
  onDataTypeChange: (value: 'mau' | 'connections') => void;
}

export const DataTypeToggle = ({ 
  dataType, 
  onDataTypeChange 
}: DataTypeToggleProps) => {
  return (
    <RadioGroup
      value={dataType}
      onValueChange={(value) => onDataTypeChange(value as 'mau' | 'connections')}
      className="flex items-center space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="mau" id="mau" />
        <Label htmlFor="mau">MAU</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="connections" id="connections" />
        <Label htmlFor="connections">Connections</Label>
      </div>
    </RadioGroup>
  );
};
