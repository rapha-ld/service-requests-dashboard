
import { format, subMonths } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: number;
  onMonthChange: (value: string) => void;
}

export const MonthSelector = ({
  selectedMonth,
  onMonthChange
}: MonthSelectorProps) => {
  // Generate abbreviated month options with year, starting from current month
  const getMonthOptions = () => {
    const today = new Date();
    
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

  return (
    <Select
      value={selectedMonth.toString()}
      onValueChange={onMonthChange}
    >
      <SelectTrigger className="w-[140px] h-10 dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
