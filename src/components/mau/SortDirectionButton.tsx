
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortDirectionButtonProps {
  sortDirection: 'desc' | 'asc';
  onSortDirectionChange: () => void;
}

export const SortDirectionButton = ({
  sortDirection,
  onSortDirectionChange
}: SortDirectionButtonProps) => {
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
