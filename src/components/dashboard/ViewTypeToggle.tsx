
import { Button } from "@/components/ui/button";

interface ViewTypeToggleProps {
  viewType: 'net-new' | 'cumulative';
  onViewTypeChange: (value: 'net-new' | 'cumulative') => void;
  visible: boolean;
}

export const ViewTypeToggle = ({ viewType, onViewTypeChange, visible }: ViewTypeToggleProps) => {
  if (!visible) return null;

  return (
    <div className="flex">
      <Button
        variant={viewType === 'cumulative' ? 'default' : 'outline'}
        onClick={() => onViewTypeChange('cumulative')}
        className={`rounded-r-none ${
          viewType === 'cumulative' 
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
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
            ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        Net New
      </Button>
    </div>
  );
};
