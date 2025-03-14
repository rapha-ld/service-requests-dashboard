
import { format, isSameYear } from "date-fns";
import { DateRange } from "@/types/mauTypes";

export const formatDateRange = (dateRange: DateRange | undefined): string => {
  if (dateRange?.from && dateRange?.to) {
    // Check if both dates are in the same year
    const sameYear = isSameYear(dateRange.from, dateRange.to);
    // Check if dates are in current year
    const isCurrentYear = isSameYear(dateRange.from, new Date()) && isSameYear(dateRange.to, new Date());
    
    if (sameYear && isCurrentYear) {
      // If same year and current year, don't show year in the display
      return `${format(dateRange.from, "MMM d, h:mm a")} - ${format(dateRange.to, "MMM d, h:mm a")}`;
    } else if (sameYear) {
      // If same year but not current year, show year only once at the end
      return `${format(dateRange.from, "MMM d, h:mm a")} - ${format(dateRange.to, "MMM d, h:mm a, yyyy")}`;
    } else {
      // If different years, show years for both dates
      return `${format(dateRange.from, "MMM d, yyyy, h:mm a")} - ${format(dateRange.to, "MMM d, yyyy, h:mm a")}`;
    }
  }
  return "Custom";
};
