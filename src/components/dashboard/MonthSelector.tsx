
import { format, subMonths } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: number;
  onMonthChange: (value: string) => void;
  visible: boolean;
}

export const MonthSelector = ({ selectedMonth, onMonthChange, visible }: MonthSelectorProps) => {
  // Generate abbreviated month options with year, starting from current month
  const getMonthOptions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Generate the last 12 months, starting with the current month
    return Array.from({ length: 13 }, (_, i) => {
      const date = subMonths(today, i);
      return {
        value: date.getMonth().toString(),
        label: format(date, "MMM yy") // Format as "Mar 25" (removed the extra quotes)
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
      <SelectTrigger className="w-[140px] h-8 dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]">
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
