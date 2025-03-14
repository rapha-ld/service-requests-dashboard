
import { Button } from "@/components/ui/button";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
}

export const ViewTypeToggle = ({
  viewType,
  onViewTypeChange
}: ViewTypeToggleProps) => {
  return (
    <div className="flex">
      <Button
        variant={viewType === 'cumulative' ? 'default' : 'outline'}
        onClick={() => onViewTypeChange('cumulative')}
        className={`rounded-r-none ${
          viewType === 'cumulative' 
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        Cumulative
      </Button>
      <Button
        variant={viewType === 'net-new' ? 'default' : 'outline'}
        onClick={() => onViewTypeChange('net-new')}
        className={`rounded-l-none border-l-0 ${
          viewType === 'net-new' 
            ? 'bg-[#F6F8FF] border-[#425EFF] text-[#425EFF] border-2' 
            : ''
        }`}
      >
        Net New
      </Button>
    </div>
  );
};
