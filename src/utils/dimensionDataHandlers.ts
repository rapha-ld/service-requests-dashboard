
import { 
  handleAllDimensionsData as handleAllDimensions,
  handleSpecificDimensionData as handleSpecificDimension
} from "./dimensionHandlers";
import { TimeRangeType, GroupingType } from "@/types/serviceData";
import { DateRange } from "@/types/mauTypes";

// Re-export the handler functions with the same names as before
export const handleAllDimensionsData = handleAllDimensions;
export const handleSpecificDimensionData = handleSpecificDimension;
