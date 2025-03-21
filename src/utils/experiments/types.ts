
import { TimeRangeType } from "@/hooks/useExperimentData";
import { DateRange } from "@/types/mauTypes";

export interface ExperimentGroup {
  id: string;
  title: string;
  value: number;
  data: Array<{ day: string; value: number | null }>;
  percentChange: number;
}

export interface ExperimentData {
  current: Record<string, Array<{ day: string; value: number | null }>>;
  previous: Record<string, Array<{ day: string; value: number | null }>>;
  currentTotals: Record<string, number>;
  previousTotals: Record<string, number>;
}
