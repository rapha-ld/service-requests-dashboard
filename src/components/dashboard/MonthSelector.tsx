
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: number;
  onMonthChange: (value: string) => void;
  visible: boolean;
}

export const MonthSelector = ({ selectedMonth, onMonthChange, visible }: MonthSelectorProps) => {
  // Generate abbreviated month options with year
  const getMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i);
      return {
        value: i.toString(),
        label: format(date, "MMM ''yy") // Format as "Jan '24"
      };
    });
  };

  const monthOptions = getMonthOptions();

  if (!visible) return null;

  return (
    <Select
      value={selectedMonth.toString()}
      onValueChange={onMonthChange}
    >
      <SelectTrigger className="w-[110px] h-8 bg-white dark:bg-black dark:border-[#6C6E7A]">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-black">
        {monthOptions.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
