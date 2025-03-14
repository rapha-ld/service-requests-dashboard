
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
        <p className="text-center font-semibold">
          {localDateRange?.from ? format(localDateRange.from, "MMMM yyyy") : "Select date"}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Double-click to change starting date
        </p>
      </div>
      <Calendar
        mode="range"
        selected={localDateRange}
        onSelect={onDateRangeChange}
        initialFocus
        className={cn("p-3 pointer-events-auto")}
      />
    </div>
  );
};
