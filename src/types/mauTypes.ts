
export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day' | '3-day' | 'custom';
export type EnvironmentData = Array<{ day: string; value: number }>;
export type EnvironmentsMap = Record<string, EnvironmentData>;

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type MAUDataResult = {
  current: EnvironmentsMap;
  previous: EnvironmentsMap;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
};

export interface ChartGroup {
  id: string;
  title: string;
  data: EnvironmentData;
  value: number;
  percentChange: number;
}
