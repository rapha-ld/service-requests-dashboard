
import { ExperimentGroup } from "./types";
import { ViewType } from "@/types/serviceData";

// Calculate maximum value for charts
export function calculateMaxValue(
  groups: ExperimentGroup[],
  viewType: ViewType
): number {
  if (viewType === 'rolling-30d') {
    // For rolling 30d, find the maximum value across all data points
    return Math.max(...groups.flatMap(env => env.data.map(d => d.value || 0)));
  }
  
  return viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value || 0)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + (item.value || 0), 0)
      ));
}
