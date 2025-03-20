
import { ReferenceLine } from 'recharts';

// Calculate the appropriate X-axis interval based on data length
export const calculateXAxisInterval = (dataLength: number) => {
  if (dataLength <= 7) return 0;
  if (dataLength <= 14) return 1;
  if (dataLength <= 30) return 2;
  return Math.floor(dataLength / 10);
};

// Component for rendering average reference line
export const AverageReferenceLine = ({ average, unit }: { average: number, unit: string }) => (
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

// Component for rendering threshold reference line
export const ThresholdReferenceLine = ({ threshold, unit }: { threshold: number, unit: string }) => (
  <ReferenceLine 
    y={threshold}
    stroke="#DB2251"
    strokeWidth={1.5}
    strokeDasharray="3 3"
    label={{
      value: `Limit: ${threshold.toLocaleString()}${unit}`,
      fill: '#DB2251',
      fontSize: 10,
      position: 'insideTopRight',
      style: { zIndex: 10 },
    }}
  />
);

// Component for rendering reset point reference lines
export const ResetPointReferenceLine = ({ day, index }: { day: string, index: number }) => (
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
