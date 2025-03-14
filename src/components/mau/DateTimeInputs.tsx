
import { TimeInput } from "@/components/mau/TimeInput";

interface DateTimeInputsProps {
  fromHour: string;
  fromPeriod: 'AM' | 'PM';
  toHour: string;
  toPeriod: 'AM' | 'PM';
  handleFromHourChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToHourChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFromPeriodChange: (value: string) => void;
  handleToPeriodChange: (value: string) => void;
}

export const DateTimeInputs = ({
  fromHour,
  fromPeriod,
  toHour,
  toPeriod,
  handleFromHourChange,
  handleToHourChange,
  handleFromPeriodChange,
  handleToPeriodChange
}: DateTimeInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TimeInput
        label="From"
        hour={fromHour}
        period={fromPeriod}
        onHourChange={handleFromHourChange}
        onPeriodChange={handleFromPeriodChange}
      />
      <TimeInput
        label="To"
        hour={toHour}
        period={toPeriod}
        onHourChange={handleToHourChange}
        onPeriodChange={handleToPeriodChange}
      />
    </div>
  );
};
