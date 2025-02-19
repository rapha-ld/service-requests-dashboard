
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
  console.log('Total value calculated:', total);
  return total;
};

const generatePercentChange = (value: number) => {
  // Generate a consistent random percentage change for demonstration
  // In a real app, this would be calculated from actual historical data
  const seed = value.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  return -20 + (seed % 40); // Generates a value between -20 and +20
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewType, setViewType] = useState<'net-new' | 'cumulative'>('net-new');

  const date = new Date(new Date().getFullYear(), selectedMonth);

  const { data: serviceData } = useQuery({
    queryKey: ['service-data', date.toISOString()],
    queryFn: () => {
      const historical = {
        development: generateMockMonthlyData(15, date),
        staging: generateMockMonthlyData(8, date),
        preProduction: generateMockMonthlyData(5, date),
        production: generateMockMonthlyData(3, date),
        testing: generateMockMonthlyData(10, date),
        qa: generateMockMonthlyData(7, date)
      };

      return {
        current: {
          development: getMostRecentValue(historical.development),
          staging: getMostRecentValue(historical.staging),
          preProduction: getMostRecentValue(historical.preProduction),
          production: getMostRecentValue(historical.production),
          testing: getMostRecentValue(historical.testing),
          qa: getMostRecentValue(historical.qa)
        },
        historical
      };
    }
  });

  if (!serviceData) return null;

  const environments = [
    { 
      id: 'development', 
      title: 'Development', 
      value: getTotalValue(serviceData.historical.development),
      data: serviceData.historical.development,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.development))
    },
    { 
      id: 'staging', 
      title: 'Staging', 
      value: getTotalValue(serviceData.historical.staging),
      data: serviceData.historical.staging,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.staging))
    },
    { 
      id: 'preProduction', 
      title: 'Pre-Production', 
      value: getTotalValue(serviceData.historical.preProduction),
      data: serviceData.historical.preProduction,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.preProduction))
    },
    { 
      id: 'production', 
      title: 'Production', 
      value: getTotalValue(serviceData.historical.production),
      data: serviceData.historical.production,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.production))
    },
    { 
      id: 'testing', 
      title: 'Testing', 
      value: getTotalValue(serviceData.historical.testing),
      data: serviceData.historical.testing,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.testing))
    },
    { 
      id: 'qa', 
      title: 'QA', 
      value: getTotalValue(serviceData.historical.qa),
      data: serviceData.historical.qa,
      percentChange: generatePercentChange(getTotalValue(serviceData.historical.qa))
    }
  ];

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const sortedEnvironments = environments.sort((a, b) => 
    sortDirection === 'desc' ? b.value - a.value : a.value - b.value
  );

  // Calculate the maximum value across all environments
  const getMaxValue = () => {
    if (viewType === 'net-new') {
      return Math.max(...environments.flatMap(env => env.data.map(d => d.value)));
    } else {
      // For cumulative view, calculate the maximum of running totals
      return Math.max(...environments.map(env => 
        env.data.reduce((sum, item) => sum + item.value, 0)
      ));
    }
  };

  const maxValue = getMaxValue();

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
