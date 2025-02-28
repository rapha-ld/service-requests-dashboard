
import React from 'react';
import { formatTooltipDate } from './formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; }>;
  label?: string;
  unit: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  unit
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card dark:bg-card/80 p-2 border rounded shadow-sm">
        <p className="text-sm font-medium">
          {payload[0].value.toLocaleString()}{unit}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatTooltipDate(label || '')}
        </p>
      </div>
    );
  }
  return null;
};
