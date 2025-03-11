
export type GroupingType = 'all' | 'environment' | 'relayId' | 'userAgent';
export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day';
export type ViewType = 'net-new' | 'cumulative';
export type ChartType = 'area' | 'line' | 'bar';

export interface ServiceData {
  current: Record<string, Array<{ day: string; value: number }>>;
  previous: Record<string, Array<{ day: string; value: number }>>;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
}
