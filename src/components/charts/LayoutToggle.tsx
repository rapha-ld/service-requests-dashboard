
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface LayoutToggleProps {
  layoutMode: 'compact' | 'expanded';
  setLayoutMode: (mode: 'compact' | 'expanded') => void;
}

export const LayoutToggle = ({ layoutMode, setLayoutMode }: LayoutToggleProps) => {
  return (
    <div className="flex">
      <Button
        variant={layoutMode === 'compact' ? 'default' : 'outline'}
        onClick={() => setLayoutMode('compact')}
        title="3 charts per row"
        className={`rounded-r-none ${
          layoutMode === 'compact' 
            ? 'dark:bg-[#0B144D] dark:border-[#7084FF] dark:text-white bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={layoutMode === 'expanded' ? 'default' : 'outline'}
        onClick={() => setLayoutMode('expanded')}
        title="6 charts per row"
        className={`rounded-l-none border-l-0 ${
          layoutMode === 'expanded' 
            ? 'dark:bg-[#0B144D] dark:border-[#7084FF] dark:text-white bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
            : ''
        }`}
      >
        <LayoutList className="h-4 w-4 rotate-90" />
      </Button>
    </div>
  );
};
