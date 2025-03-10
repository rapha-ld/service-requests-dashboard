import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { DashboardCharts } from "@/components/DashboardCharts";
import { getMockData } from "@/utils/mockDataGenerator";
import { getTotalValue, calculatePercentChange } from "@/utils/dataTransformers";
import { format, subMonths } from "date-fns";
import { useRef } from "react";

type GroupingType = 'all' | 'environment' | 'relayId' | 'userAgent';
type TimeRangeType = 'month-to-date' | 'last-12-months';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [grouping, setGrouping] = useState<GroupingType>('environment');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month-to-date');
  const chartRefs = useRef<{ [key: string]: any }>({});

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: serviceData } = useQuery({
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

  if (!serviceData) return null;

  const groups = Object.entries(serviceData.current).map(([id, data]) => ({
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    value: serviceData.currentTotals[id],
    data,
    percentChange: calculatePercentChange(
      serviceData.currentTotals[id],
      serviceData.previousTotals[id]
    )
  }));

  const sortedGroups = groups.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  const maxValue = viewType === 'net-new'
    ? Math.max(...groups.flatMap(env => env.data.map(d => d.value)))
    : Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));

  const allEnvironmentsData = grouping === 'all'
    ? sortedGroups[0]?.data || []
    : Object.values(serviceData.current)[0].map((_, index) => ({
        day: timeRange === 'last-12-months' 
          ? Object.values(serviceData.current)[0][index].day
          : (index + 1).toString(),
        value: Object.values(serviceData.current).reduce((sum, data) => sum + data[index].value, 0)
      }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Service Requests</h1>
        
        <DashboardHeader
          grouping={grouping}
          viewType={viewType}
          chartType={chartType}
          selectedMonth={selectedMonth}
          sortDirection={sortDirection}
          onGroupingChange={setGrouping}
          onViewTypeChange={setViewType}
          onChartTypeChange={setChartType}
          onSortDirectionChange={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          onMonthChange={(value) => setSelectedMonth(parseInt(value))}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        
        {grouping !== 'all' && <DashboardSummary groups={sortedGroups} />}
        
        <DashboardCharts
          allEnvironmentsData={allEnvironmentsData}
          sortedGroups={sortedGroups}
          viewType={viewType}
          chartType={chartType}
          maxValue={maxValue}
          grouping={grouping}
          chartRefs={chartRefs}
          onExportChart={() => {}}
          useViewDetailsButton={false}
          showOnlyTotal={grouping === 'all'}
        />
      </div>
    </div>
  );
};

export default Dashboard;
