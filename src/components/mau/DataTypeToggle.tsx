
import { Button } from "@/components/ui/button";

interface DataTypeToggleProps {
  dataType: 'mau' | 'connections';
  onDataTypeChange: (value: 'mau' | 'connections') => void;
}

export const DataTypeToggle = ({ 
  dataType, 
  onDataTypeChange 
}: DataTypeToggleProps) => {
  return (
    <div className="flex">
      <Button
        variant={dataType === 'mau' ? 'default' : 'outline'}
        onClick={() => onDataTypeChange('mau')}
        className={`rounded-r-none ${
          dataType === 'mau' 
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        MAU
      </Button>
      <Button
        variant={dataType === 'connections' ? 'default' : 'outline'}
        onClick={() => onDataTypeChange('connections')}
        className={`rounded-l-none border-l-0 ${
          dataType === 'connections' 
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        Connections
      </Button>
    </div>
  );
};
