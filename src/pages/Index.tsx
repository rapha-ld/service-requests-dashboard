
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BarChart3, LineChart } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

type GroupingType = 'environment' | 'relayId' | 'userAgent';

const generateMockMonthlyData = (baseValue: number, date: Date) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: `${i + 1}`,
    value: Math.max(0, baseValue + Math.floor(Math.random() * 20 - 10))
  }));
};

const getMockData = (grouping: GroupingType) => {
  switch (grouping) {
    case 'relayId':
      return {
        'Relay-001': generateMockMonthlyData(12, new Date()),
        'Relay-002': generateMockMonthlyData(8, new Date()),
        'Relay-003': generateMockMonthlyData(15, new Date()),
        'Relay-004': generateMockMonthlyData(6, new Date()),
        'Relay-005': generateMockMonthlyData(10, new Date()),
        'Relay-006': generateMockMonthlyData(9, new Date()),
      };
    case 'userAgent':
      return {
        'Chrome': generateMockMonthlyData(20, new Date()),
        'Firefox': generateMockMonthlyData(15, new Date()),
        'Safari': generateMockMonthlyData(10, new Date()),
        'Edge': generateMockMonthlyData(8, new Date()),
        'Mobile': generateMockMonthlyData(12, new Date()),
        'Other': generateMockMonthlyData(5, new Date()),
      };
    default:
      return {
        development: generateMockMonthlyData(15, new Date()),
        staging: generateMockMonthlyData(8, new Date()),
        preProduction: generateMockMonthlyData(5, new Date()),
        production: generateMockMonthlyData(3, new Date()),
        testing: generateMockMonthlyData(10, new Date()),
        qa: generateMockMonthlyData(7, new Date()),
      };
  }
};

const getRequestStatus = (value: number) => {
  if (value <= 200) return 'good';
  if (value <= 400) return 'moderate';
  return 'poor';
};

const getTotalValue = (data: Array<{ day: string; value: number }>) => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

const calculatePercentChange = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [grouping, setGrouping] = useState<GroupingType>('environment');

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: serviceData } = useQuery({
    queryKey: ['service-data', currentDate.toISOString(), grouping],
    queryFn: () => {
      const current = getMockData(grouping);
      const previous = getMockData(grouping);

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

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const sortedGroups = groups.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  const getMaxValue = () => {
    if (viewType === 'net-new') {
      return Math.max(...groups.flatMap(env => env.data.map(d => d.value)));
    } else {
      return Math.max(...groups.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
    }
  };

  const maxValue = getMaxValue();

  const allEnvironmentsData = Object.values(serviceData.current)[0].map((_, index) => ({
    day: (index + 1).toString(),
    value: Object.values(serviceData.current).reduce((sum, data) => sum + data[index].value, 0)
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Service Requests</h1>
        
        <div className="flex gap-2 items-center mb-6">
          <Select
            value={grouping}
            onValueChange={(value) => setGrouping(value as GroupingType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="relayId">Relay ID</SelectItem>
              <SelectItem value="userAgent">User Agent</SelectItem>
            </SelectContent>
          </Select>
          
          <ThemeToggle />
          <div className="flex">
            <Button
              variant={viewType === 'net-new' ? 'default' : 'outline'}
              onClick={() => setViewType('net-new')}
              className="rounded-r-none"
            >
              Net New
            </Button>
            <Button
              variant={viewType === 'cumulative' ? 'default' : 'outline'}
              onClick={() => setViewType('cumulative')}
              className="rounded-l-none border-l-0"
            >
              Cumulative
            </Button>
          </div>
          <div className="flex">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              onClick={() => setChartType('area')}
              className="rounded-r-none"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Area
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
              className="rounded-l-none border-l-0"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Bar
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleSortClick}
            className="h-10"
            title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
          >
            <ArrowUpDown className="h-4 w-4 text-primary" />
            Sort
          </Button>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month} {new Date().getFullYear()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {sortedGroups.map(group => (
            <SummaryCard
              key={group.id}
              title={group.title}
              value={group.value}
              unit=""
              status={getRequestStatus(group.value)}
              percentChange={group.percentChange}
            />
          ))}
        </div>

        <div className="mb-6">
          <SmallMultiple
            title="All Environments"
            data={allEnvironmentsData}
            color="#2AB4FF"
            unit="reqs"
            viewType={viewType}
            maxValue={viewType === 'cumulative' 
              ? Math.max(...allEnvironmentsData.reduce((acc, curr, index) => {
                  const previousValue = index > 0 ? acc[index - 1] : 0;
                  acc[index] = previousValue + curr.value;
                  return acc;
                }, [] as number[]))
              : Math.max(...allEnvironmentsData.map(d => d.value))
            }
            chartType={chartType}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGroups.map(group => (
            <SmallMultiple
              key={group.id}
              title={group.title}
              data={group.data}
              color="#2AB4FF"
              unit="reqs"
              viewType={viewType}
              maxValue={maxValue}
              chartType={chartType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

