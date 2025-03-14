
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
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
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
            ? 'dark:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Connections
      </Button>
    </div>
  );
};
