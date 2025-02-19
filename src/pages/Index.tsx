
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

const generateMockMonthlyData = (baseValue: number, date: Date) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: `${i + 1}`,
    value: Math.max(0, baseValue + Math.floor(Math.random() * 20 - 10))
  }));
};

const getRequestStatus = (value: number) => {
  if (value <= 200) return 'good';
  if (value <= 400) return 'moderate';
  return 'poor';
};

const getMostRecentValue = (data: Array<{ day: string; value: number }>) => {
  return data[data.length - 1]?.value || 0;
};

const getTotalValue = (data: Array<{ day: string; value: number }>) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return total;
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

  const currentDate = new Date(new Date().getFullYear(), selectedMonth);
  const previousDate = new Date(new Date().getFullYear(), selectedMonth - 1);

  const { data: serviceData } = useQuery({
    queryKey: ['service-data', currentDate.toISOString()],
    queryFn: () => {
      const current = {
        development: generateMockMonthlyData(15, currentDate),
        staging: generateMockMonthlyData(8, currentDate),
        preProduction: generateMockMonthlyData(5, currentDate),
        production: generateMockMonthlyData(3, currentDate),
        testing: generateMockMonthlyData(10, currentDate),
        qa: generateMockMonthlyData(7, currentDate)
      };

      const previous = {
        development: generateMockMonthlyData(15, previousDate),
        staging: generateMockMonthlyData(8, previousDate),
        preProduction: generateMockMonthlyData(5, previousDate),
        production: generateMockMonthlyData(3, previousDate),
        testing: generateMockMonthlyData(10, previousDate),
        qa: generateMockMonthlyData(7, previousDate)
      };

      return {
        current,
        previous,
        currentTotals: {
          development: getTotalValue(current.development),
          staging: getTotalValue(current.staging),
          preProduction: getTotalValue(current.preProduction),
          production: getTotalValue(current.production),
          testing: getTotalValue(current.testing),
          qa: getTotalValue(current.qa)
        },
        previousTotals: {
          development: getTotalValue(previous.development),
          staging: getTotalValue(previous.staging),
          preProduction: getTotalValue(previous.preProduction),
          production: getTotalValue(previous.production),
          testing: getTotalValue(previous.testing),
          qa: getTotalValue(previous.qa)
        }
      };
    }
  });

  if (!serviceData) return null;

  const environments = [
    { 
      id: 'development', 
      title: 'Development', 
      value: serviceData.currentTotals.development,
      data: serviceData.current.development,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.development,
        serviceData.previousTotals.development
      )
    },
    { 
      id: 'staging', 
      title: 'Staging', 
      value: serviceData.currentTotals.staging,
      data: serviceData.current.staging,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.staging,
        serviceData.previousTotals.staging
      )
    },
    { 
      id: 'preProduction', 
      title: 'Pre-Production', 
      value: serviceData.currentTotals.preProduction,
      data: serviceData.current.preProduction,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.preProduction,
        serviceData.previousTotals.preProduction
      )
    },
    { 
      id: 'production', 
      title: 'Production', 
      value: serviceData.currentTotals.production,
      data: serviceData.current.production,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.production,
        serviceData.previousTotals.production
      )
    },
    { 
      id: 'testing', 
      title: 'Testing', 
      value: serviceData.currentTotals.testing,
      data: serviceData.current.testing,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.testing,
        serviceData.previousTotals.testing
      )
    },
    { 
      id: 'qa', 
      title: 'QA', 
      value: serviceData.currentTotals.qa,
      data: serviceData.current.qa,
      percentChange: calculatePercentChange(
        serviceData.currentTotals.qa,
        serviceData.previousTotals.qa
      )
    }
  ];

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const sortedEnvironments = environments.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  const getMaxValue = () => {
    if (viewType === 'net-new') {
      return Math.max(...environments.flatMap(env => env.data.map(d => d.value)));
    } else {
      return Math.max(...environments.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
    }
  };

  const maxValue = getMaxValue();

  // Calculate the combined data for all environments
  const allEnvironmentsData = serviceData.current.development.map((item, index) => ({
    day: item.day,
    value: environments.reduce((sum, env) => sum + env.data[index].value, 0)
  }));

  return (
    <div className="min-h-screen bg-aqi-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-aqi-text">Service Requests</h1>
          
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              onClick={handleSortClick}
              className="h-10"
              title={sortDirection === 'desc' ? "Sort ascending" : "Sort descending"}
            >
              <ArrowUpDown className={`h-4 w-4 text-primary`} />
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {sortedEnvironments.map(env => (
            <SummaryCard
              key={env.id}
              title={env.title}
              value={env.value}
              unit=""
              status={getRequestStatus(env.value)}
              percentChange={env.percentChange}
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
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEnvironments.map(env => (
            <SmallMultiple
              key={env.id}
              title={env.title}
              data={env.data}
              color="#2AB4FF"
              unit="reqs"
              viewType={viewType}
              maxValue={maxValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
