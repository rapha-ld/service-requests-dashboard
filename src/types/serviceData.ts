
export type GroupingType = 'all' | 'environment' | 'relayId' | 'userAgent';
export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day' | '3-day' | 'custom';
export type ViewType = 'net-new' | 'cumulative' | 'rolling-30d';
export type ChartType = 'area' | 'line' | 'bar';

export interface ServiceData {
  current: Record<string, Array<{ day: string; value: number }>>;
  previous: Record<string, Array<{ day: string; value: number }>>;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
}
