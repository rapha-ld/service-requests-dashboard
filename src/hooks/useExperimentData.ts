import { useQuery } from "@tanstack/react-query";
import { getMockData } from "@/utils/mockDataGenerator";
import { getTotalValue } from "@/utils/dataTransformers";
import { format, subMonths, subDays } from "date-fns";

export type TimeRangeType = 'month-to-date' | 'last-12-months' | 'rolling-30-day';

export function useExperimentData(timeRange: TimeRangeType, currentDate: Date) {
  return useQuery({
    queryKey: ['experiment-data', currentDate.toISOString(), timeRange],
    queryFn: () => {
      const current = getMockData('environment');
      const previous = getMockData('environment');

      const experimentNames = [
        'Development', 'Staging', 'Production', 
        'QA', 'Integration', 'UAT', 
        'Training', 'Demo', 'Sandbox'
      ];
      
      const currentExperiments: Record<string, any> = {};
      const previousExperiments: Record<string, any> = {};
      
      Object.values(current).forEach((data, index) => {
        if (index < experimentNames.length) {
          currentExperiments[experimentNames[index]] = data;
        }
      });
      
      Object.values(previous).forEach((data, index) => {
        if (index < experimentNames.length) {
          previousExperiments[experimentNames[index]] = data;
        }
      });

      if (timeRange === 'last-12-months') {
        const last12MonthsData = Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [
            key,
            Array.from({ length: 12 }, (_, i) => ({
              day: format(subMonths(new Date(), i), 'MMM'),
              value: Math.floor(Math.random() * 1000)
            })).reverse()
          ])
        );
        
        return {
          current: last12MonthsData,
          previous: previousExperiments,
          currentTotals: Object.fromEntries(
            Object.entries(last12MonthsData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }
      
      if (timeRange === 'rolling-30-day') {
        const today = new Date();
        
        const rolling30DayData = Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [
            key,
            Array.from({ length: 30 }, (_, i) => {
              const date = subDays(today, 29 - i);
              const isFutureDate = date > today;
              
              return {
                day: format(date, 'MMM d'),
                value: isFutureDate ? null : Math.floor(Math.random() * 500)
              };
            })
          ])
        );
        
        return {
          current: rolling30DayData,
          previous: previousExperiments,
          currentTotals: Object.fromEntries(
            Object.entries(rolling30DayData).map(([key, data]) => [key, getTotalValue(data)])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }

      if (timeRange === 'month-to-date') {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const startDate = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const currentDay = today.getDate();
        
        const monthToDateData = Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [
            key,
            Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isFutureDate = day > currentDay;
              
              return {
                day: format(new Date(currentYear, currentMonth, day), 'MMM d'),
                value: isFutureDate ? null : Math.floor(Math.random() * 300)
              };
            })
          ])
        );
        
        return {
          current: monthToDateData,
          previous: previousExperiments,
          currentTotals: Object.fromEntries(
            Object.entries(monthToDateData).map(([key, data]) => [
              key, 
              getTotalValue(data.filter(item => item.value !== null))
            ])
          ),
          previousTotals: Object.fromEntries(
            Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
          )
        };
      }

      return {
        current: currentExperiments,
        previous: previousExperiments,
        currentTotals: Object.fromEntries(
          Object.entries(currentExperiments).map(([key, data]) => [key, getTotalValue(data)])
        ),
        previousTotals: Object.fromEntries(
          Object.entries(previousExperiments).map(([key, data]) => [key, getTotalValue(data)])
        )
      };
    }
  });
}
