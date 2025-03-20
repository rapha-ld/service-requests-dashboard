
import { Area, AreaChart, Bar, BarChart, Line, LineChart } from 'recharts';

interface DataComponentProps {
  type: 'area' | 'bar' | 'line';
  dataKey: string;
  stroke: string;
  fill?: string;
  strokeWidth?: number;
  radius?: [number, number, number, number];
  connectNulls?: boolean;
  dot?: boolean | object;
}

export const DataComponent = ({
  type,
  dataKey,
  stroke,
  fill,
  strokeWidth = 2,
  radius = [1.5, 1.5, 0, 0],
  connectNulls = true,
  dot = false
}: DataComponentProps) => {
  switch (type) {
    case 'area':
      return (
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          fill={fill || "url(#colorGradient)"}
          strokeWidth={strokeWidth}
          connectNulls={connectNulls}
        />
      );
    case 'bar':
      return (
        <Bar
          dataKey={dataKey}
          fill={stroke}
          radius={radius}
        />
      );
    case 'line':
      return (
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={strokeWidth}
          dot={dot}
          connectNulls={connectNulls}
        />
      );
    default:
      return null;
  }
};

export const getChartComponent = (chartType: 'area' | 'bar' | 'line') => {
  switch (chartType) {
    case 'area':
      return AreaChart;
    case 'bar':
      return BarChart;
    case 'line':
      return LineChart;
    default:
      return AreaChart; // Default to AreaChart
  }
};
