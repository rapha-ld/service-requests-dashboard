
import { ExperimentGroup } from "./types";

// Calculate maximum value for charts
export function calculateMaxValue(
  groups: ExperimentGroup[],
  viewType: 'net-new' | 'cumulative'
): number {
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value || 0)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + (item.value || 0), 0)
      ));
}
