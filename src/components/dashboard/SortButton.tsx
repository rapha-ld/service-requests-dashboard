
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortButtonProps {
  sortDirection: 'desc' | 'asc';
  onSortDirectionChange: () => void;
  visible: boolean;
}

export const SortButton = ({ sortDirection, onSortDirectionChange, visible }: SortButtonProps) => {
  if (!visible) return null;

  return (
    <Button
      variant="outline"
      onClick={onSortDirectionChange}
      className="h-10 ml-2"
      title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
    >
      <ArrowUpDown className="h-4 w-4 text-primary" />
      Sort
    </Button>
  );
};
