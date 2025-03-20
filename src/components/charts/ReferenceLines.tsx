
import React from 'react';
import { AverageReferenceLine, ThresholdReferenceLine, ResetPointReferenceLine } from './ChartHelpers';

interface ReferenceLinesProps {
  viewType: 'net-new' | 'cumulative';
  average: number;
  unit: string;
  showThreshold: boolean;
  threshold?: number;
  resetPoints: string[];
}

export const ReferenceLines: React.FC<ReferenceLinesProps> = ({
  viewType,
  average,
  unit,
  showThreshold,
  threshold,
  resetPoints
}) => {
  return (
    <>
      {viewType === 'net-new' && (
        <AverageReferenceLine average={average} unit={unit} />
      )}
      
      {showThreshold && threshold && (
        <ThresholdReferenceLine threshold={threshold} unit={unit} />
      )}
      
      {resetPoints.map((day, index) => (
        <ResetPointReferenceLine key={`reset-line-${index}`} day={day} index={index} />
      ))}
    </>
  );
};
