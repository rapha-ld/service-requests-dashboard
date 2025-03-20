
import React from 'react';
import { ReferenceLine } from 'recharts';
import { calculateAverage } from './dataTransformers';

interface ThresholdLineProps {
  threshold: number;
}

export const ThresholdLine = ({ threshold }: ThresholdLineProps) => {
  return (
    <ReferenceLine 
      y={threshold}
      stroke="#DB2251"
      strokeWidth={1.5}
      strokeDasharray="3 3"
      label={{
        value: `Limit: ${threshold.toLocaleString()}`,
        fill: '#DB2251',
        fontSize: 10,
        position: 'insideTopRight',
        style: { zIndex: 10 },
      }}
    />
  );
};

interface AverageLineProps {
  data: Array<{ day: string; value: number | null }>;
  unit: string;
}

export const AverageLine = ({ data, unit }: AverageLineProps) => {
  const average = calculateAverage(data);
  
  return (
    <ReferenceLine 
      y={average}
      stroke="currentColor"
      strokeDasharray="3 3"
      strokeOpacity={0.5}
      label={{
        value: `Avg: ${average.toFixed(1)}${unit}`,
        fill: 'hsl(var(--secondary-foreground))',
        fontSize: 10,
        position: 'insideTopRight',
        style: { zIndex: 10 },
        dy: -15
      }}
    />
  );
};

interface ResetPointsProps {
  resetPoints: string[];
  transformedData: Array<{ day: string; value: number | null }>;
}

export const ResetPoints = ({ resetPoints, transformedData }: ResetPointsProps) => {
  return (
    <>
      {resetPoints.map((day, index) => {
        const dataIndex = transformedData.findIndex((d: any) => d.day === day);
        if (dataIndex === -1) return null;
        if (dataIndex === 0) return null;
        return (
          <ReferenceLine 
            key={`reset-${index}`}
            x={day}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            label={{
              value: "Monthly usage reset",
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 9,
              position: 'insideTopLeft',
              offset: 8,
              style: { zIndex: 10, textAnchor: 'start' },
              dy: -4
            }}
          />
        );
      })}
    </>
  );
};
