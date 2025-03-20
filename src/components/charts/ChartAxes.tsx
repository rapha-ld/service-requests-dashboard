
import React from 'react';
import { XAxis, YAxis } from 'recharts';
import { formatYAxisTick } from './formatters';

interface ChartAxesProps {
  transformedData: Array<any>;
  effectiveMaxValue: number;
  xAxisInterval: number;
}

export const ChartAxes: React.FC<ChartAxesProps> = ({ 
  transformedData, 
  effectiveMaxValue, 
  xAxisInterval 
}) => {
  return (
    <>
      <XAxis 
        dataKey="day" 
        tick={{ fontSize: 10 }}
        interval={xAxisInterval}
        tickLine={false}
        stroke="currentColor"
        className="text-muted-foreground"
        ticks={transformedData.length > 0 ? 
          [transformedData[0].day, 
           ...transformedData.slice(1, -1).filter((_, i) => (i + 1) % (xAxisInterval + 1) === 0).map(d => d.day),
           transformedData[transformedData.length - 1].day] 
          : []}
      />
      <YAxis 
        tick={{ fontSize: 10 }}
        tickLine={false}
        axisLine={false}
        domain={[0, effectiveMaxValue]}
        width={40}
        stroke="currentColor"
        className="text-muted-foreground"
        tickFormatter={formatYAxisTick}
      />
    </>
  );
};
