
import { AreaChart, Area, BarChart, Bar, LineChart, Line } from 'recharts';

// Types for charts
export type ChartComponentType = 'area' | 'bar' | 'line';

// Component to render the appropriate chart type
export const renderChartComponent = (chartType: ChartComponentType) => {
  switch(chartType) {
    case 'area':
      return {
        ChartComponent: AreaChart,
        DataComponent: Area,
        fillProps: {
          fill: "url(#colorGradient)",
          stroke: "#30459B",
          strokeWidth: 2,
          connectNulls: true,
        }
      };
    case 'bar':
      return {
        ChartComponent: BarChart,
        DataComponent: Bar,
        fillProps: {
          fill: "#30459B",
          radius: [1.5, 1.5, 0, 0],
        }
      };
    case 'line':
      return {
        ChartComponent: LineChart,
        DataComponent: Line,
        fillProps: {
          stroke: "#30459B",
          strokeWidth: 2,
          dot: false,
          connectNulls: true,
        }
      };
    default:
      return {
        ChartComponent: AreaChart,
        DataComponent: Area,
        fillProps: {
          fill: "url(#colorGradient)",
          stroke: "#30459B",
          strokeWidth: 2,
          connectNulls: true,
        }
      };
  }
};
