
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
      // Create a unique value by combining year and month
      const value = `${date.getFullYear()}-${date.getMonth()}`;
      return {
        value,
        label: format(date, "MMM 'yy") // Format as "Mar 25"
      };
    });
  };

  const monthOptions = getMonthOptions();
  
  // Find the current selected option based on the selectedMonth
  const today = new Date();
  const currentYear = today.getFullYear();
  const selectedValue = monthOptions.find(option => {
    const [year, month] = option.value.split('-');
    return parseInt(month) === selectedMonth;
  })?.value || `${currentYear}-${selectedMonth}`;

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => {
        const [year, month] = value.split('-');
        // Pass both year and month so we can create proper date objects
        onMonthChange(`${year}-${month}`);
      }}
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
