
import { useQuery } from "@tanstack/react-query";
import { format, subMonths, subDays } from "date-fns";
import { getMockData } from "@/utils/mockDataGenerator";
import { getTotalValue } from "@/utils/dataTransformers";

export type GroupingType = 'all' | 'environment' | 'relayId' | 'userAgent';
export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day';
export type ViewType = 'net-new' | 'cumulative';
export type ChartType = 'area' | 'line' | 'bar';

export const useServiceData = (
  selectedMonth: number,
  grouping: GroupingType,
  timeRange: TimeRangeType
) => {
  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  return useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping, timeRange],
    queryFn: () => {
      if (grouping === 'all') {
        const environmentData = getMockData('environment');
        const relayIdData = getMockData('relayId');
        const userAgentData = getMockData('userAgent');
        
        const combineData = (dataSets: Record<string, Array<{ day: string; value: number }>>[]) => {
          const firstDataSet = dataSets[0];
          const firstKey = Object.keys(firstDataSet)[0];
          const template = firstDataSet[firstKey].map(item => ({ day: item.day, value: 0 }));
          
          dataSets.forEach(dataSet => {
            Object.values(dataSet).forEach(dimensionData => {
              dimensionData.forEach((dayData, index) => {
                template[index].value += dayData.value;
              });
            });
          });
          
          return { total: template };
        };
        
        if (timeRange === 'last-12-months') {
          const environmentLast12Months = Object.fromEntries(
            Object.entries(environmentData).map(([key, data]) => [
              key,
              Array.from({ length: 12 }, (_, i) => ({
                day: format(subMonths(new Date(), i), 'MMM'),
                value: Math.floor(Math.random() * 1000)
              })).reverse()
            ])
          );
          
          const relayIdLast12Months = Object.fromEntries(
            Object.entries(relayIdData).map(([key, data]) => [
              key,
              Array.from({ length: 12 }, (_, i) => ({
                day: format(subMonths(new Date(), i), 'MMM'),
                value: Math.floor(Math.random() * 1000)
              })).reverse()
            ])
          );
          
          const userAgentLast12Months = Object.fromEntries(
            Object.entries(userAgentData).map(([key, data]) => [
              key,
              Array.from({ length: 12 }, (_, i) => ({
                day: format(subMonths(new Date(), i), 'MMM'),
                value: Math.floor(Math.random() * 1000)
              })).reverse()
            ])
          );
          
          const combined = combineData([environmentLast12Months, relayIdLast12Months, userAgentLast12Months]);
          
          return {
            current: combined,
            previous: combined,
            currentTotals: {
              total: getTotalValue(combined.total)
            },
            previousTotals: {
              total: getTotalValue(combined.total)
            }
          };
        }
        
        // Add support for rolling 30 day view
        if (timeRange === 'rolling-30-day') {
          const environmentRolling30Days = Object.fromEntries(
            Object.entries(environmentData).map(([key, data]) => [
              key,
              Array.from({ length: 30 }, (_, i) => ({
                day: format(subDays(new Date(), 29 - i), 'MMM d'),
                value: Math.floor(Math.random() * 500)
              }))
            ])
          );
          
          const relayIdRolling30Days = Object.fromEntries(
            Object.entries(relayIdData).map(([key, data]) => [
              key,
              Array.from({ length: 30 }, (_, i) => ({
                day: format(subDays(new Date(), 29 - i), 'MMM d'),
                value: Math.floor(Math.random() * 500)
              }))
            ])
          );
          
          const userAgentRolling30Days = Object.fromEntries(
            Object.entries(userAgentData).map(([key, data]) => [
              key,
              Array.from({ length: 30 }, (_, i) => ({
                day: format(subDays(new Date(), 29 - i), 'MMM d'),
                value: Math.floor(Math.random() * 500)
              }))
            ])
          );
          
          const combined = combineData([environmentRolling30Days, relayIdRolling30Days, userAgentRolling30Days]);
          
          return {
            current: combined,
            previous: combined,
            currentTotals: {
              total: getTotalValue(combined.total)
            },
            previousTotals: {
              total: getTotalValue(combined.total)
            }
          };
        }
        
        const combined = combineData([environmentData, relayIdData, userAgentData]);
        
        return {
          current: combined,
          previous: combined,
          currentTotals: {
            total: getTotalValue(combined.total)
          },
          previousTotals: {
            total: getTotalValue(combined.total)
          }
        };
      }
      
      const current = getMockData(grouping);
      const previous = getMockData(grouping);

      if (timeRange === 'last-12-months') {
        const last12MonthsData = Object.fromEntries(
          Object.entries(current).map(([key, data]) => [
            key,
            Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 1000)
            })).reverse()
          ])
        );
        return {
          current: last12MonthsData,
          previous,
          currentTotals: Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }
      
      // Add support for rolling 30 day view
      if (timeRange === 'rolling-30-day') {
        const rolling30DayData = Object.fromEntries(
          Object.entries(current).map(([key, data]) => [
            key,
            Array.from({ length: 30 }, (_, i) => ({
              day: format(subDays(new Date(), 29 - i), 'MMM d'),
              value: Math.floor(Math.random() * 500)
            }))
          ])
        );
        return {
          current: rolling30DayData,
          previous,
          currentTotals: Object.fromEntries(
            Object.entries(rolling30DayData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }

      return {
        current,
        previous,
        currentTotals: Object.fromEntries(
          Object.entries(current).map(([key, data]) => [key, getTotalValue(data)])
        ),
        previousTotals: Object.fromEntries(
          Object.entries(previous).map(([key, data]) => [key, getTotalValue(data)])
        )
      };
    }
  });
};
