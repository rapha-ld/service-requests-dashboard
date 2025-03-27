import React from "react";
import { Link } from "react-router-dom";
interface PlanUsageSectionHeaderProps {
  action?: React.ReactNode;
}
export const PlanUsageSectionHeader: React.FC<PlanUsageSectionHeaderProps> = ({
  action
}) => {
  return <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground text-left">Plan Usage</h3>
          <Link to="/upgrade" className="text-xs text-muted-foreground underline hover:no-underline">
            Upgrade
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">Monthly usage resets on the first of the month UTC</p>
      </div>
      {action && <div className="mb-2">
          {action}
        </div>}
    </div>;
};