
import React from "react";
import { FormattedCardTitle } from "../card/FormattedCardTitle";

interface RemainingItem {
  title: string;
  remaining: number;
  percentRemaining: number;
  unit: string;
}

interface RemainingUsageTableProps {
  remainingData: RemainingItem[];
}

export const RemainingUsageTable: React.FC<RemainingUsageTableProps> = ({ remainingData }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm dark:bg-secondary dark:border dark:border-border h-[224px]">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-left">Remaining this month</h3>
      <div className="overflow-y-auto max-h-[168px]">
        <table className="w-full text-sm">
          <tbody>
            {remainingData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 text-left text-muted-foreground">
                  <FormattedCardTitle title={item.title} />
                </td>
                <td className="py-2 text-right">
                  <span className={item.remaining === 0 ? "text-[#ea384c]" : ""}>
                    {item.remaining.toLocaleString()}{item.unit}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className={item.percentRemaining === 0 ? "text-[#ea384c]" : ""}>
                    {Math.round(item.percentRemaining)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
