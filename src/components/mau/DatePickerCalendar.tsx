
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "@/types/mauTypes";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerCalendarProps {
  localDateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const DatePickerCalendar = ({
  localDateRange,
  onDateRangeChange
}: DatePickerCalendarProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-1">
        <p className="text-center font-semibold text-[#222222] dark:text-white">
          {localDateRange?.from ? format(localDateRange.from, "MMMM yyyy") : "Select date"}
        </p>
        <p className="text-center text-sm text-[#555555] dark:text-[#C8C8C9]">
          Select a date range
        </p>
      </div>
      <Calendar
        mode="range"
        selected={localDateRange}
        onSelect={onDateRangeChange}
        initialFocus
        className={cn("p-3 pointer-events-auto")}
        numberOfMonths={1}
        classNames={{
          day_today: "bg-[#F1F1F1] text-[#222222] dark:bg-[#403E43] dark:text-white",
          day_selected: "bg-[#425EFF] text-white hover:bg-[#425EFF] hover:text-white focus:bg-[#425EFF] focus:text-white dark:bg-[#425EFF] dark:text-white",
          day_range_middle: "aria-selected:bg-[#F6F8FF] aria-selected:text-[#425EFF] dark:aria-selected:bg-[#0B144D] dark:aria-selected:text-white",
          day: "text-[#222222] dark:text-white h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          head_cell: "text-[#555555] dark:text-[#C8C8C9] rounded-md w-9 font-normal text-[0.8rem]",
          caption_label: "text-[#222222] dark:text-white text-sm font-medium",
          nav_button: "bg-white text-[#222222] hover:bg-[#F1F1F1] dark:bg-black dark:text-white dark:hover:bg-[#2C2C2C] dark:border-[#6C6E7A]",
        }}
      />
    </div>
  );
};
