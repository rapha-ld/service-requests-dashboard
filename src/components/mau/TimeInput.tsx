
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeInputProps {
  label: string;
  hour: string;
  period: 'AM' | 'PM';
  onHourChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPeriodChange: (value: string) => void;
}

export const TimeInput = ({
  label,
  hour,
  period,
  onHourChange,
  onPeriodChange
}: TimeInputProps) => {
  return (
    <div>
      <Label className="mb-2 block">{label}:</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="12"
          value={hour}
          onChange={onHourChange}
          className="w-16"
        />
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
