
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GroupingSelectorProps {
  grouping: 'all' | 'environment' | 'relayId' | 'userAgent';
  onGroupingChange: (value: 'all' | 'environment' | 'relayId' | 'userAgent') => void;
  visible: boolean;
}

export const GroupingSelector = ({ grouping, onGroupingChange, visible }: GroupingSelectorProps) => {
  if (!visible) return null;

  return (
    <Select
      value={grouping}
      onValueChange={(value) => onGroupingChange(value as 'all' | 'environment' | 'relayId' | 'userAgent')}
    >
      <SelectTrigger className="w-[180px] h-8 bg-white">
        <SelectValue placeholder="Select grouping" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All dimensions</SelectItem>
        <SelectItem value="environment">Environment</SelectItem>
        <SelectItem value="relayId">Relay ID</SelectItem>
        <SelectItem value="userAgent">User Agent</SelectItem>
      </SelectContent>
    </Select>
  );
};
