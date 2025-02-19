
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";
import { format } from "date-fns";
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
  if (value <= 10) return 'good';
  if (value <= 20) return 'moderate';
  return 'poor';
};

const getMostRecentValue = (data: Array<{ day: string; value: number }>) => {
  return data[data.length - 1]?.value || 0;
};

const getTotalValue = (data: Array<{ day: string; value: number }>) => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isSorted, setIsSorted] = useState(false);

  const date = new Date(new Date().getFullYear(), selectedMonth);

  const { data: serviceData } = useQuery({
    queryKey: ['service-data', date.toISOString()],
    queryFn: () => {
      const historical = {
        development: generateMockMonthlyData(15, date),
        staging: generateMockMonthlyData(8, date),
        preProduction: generateMockMonthlyData(5, date),
        production: generateMockMonthlyData(3, date)
      };

      return {
        current: {
          development: getMostRecentValue(historical.development),
          staging: getMostRecentValue(historical.staging),
          preProduction: getMostRecentValue(historical.preProduction),
          production: getMostRecentValue(historical.production)
        },
        historical
      };
    },
    initialData: () => {
      const historical = {
        development: generateMockMonthlyData(15, date),
        staging: generateMockMonthlyData(8, date),
        preProduction: generateMockMonthlyData(5, date),
        production: generateMockMonthlyData(3, date)
      };

      return {
        current: {
          development: getMostRecentValue(historical.development),
          staging: getMostRecentValue(historical.staging),
          preProduction: getMostRecentValue(historical.preProduction),
          production: getMostRecentValue(historical.production)
        },
        historical
      };
    }
  });

  const environments = [
    { 
      id: 'development', 
      title: 'Development', 
      value: serviceData.current.development, 
      data: serviceData.historical.development,
      total: getTotalValue(serviceData.historical.development)
    },
    { 
      id: 'staging', 
      title: 'Staging', 
      value: serviceData.current.staging, 
      data: serviceData.historical.staging,
      total: getTotalValue(serviceData.historical.staging)
    },
    { 
      id: 'preProduction', 
      title: 'Pre-Production', 
      value: serviceData.current.preProduction, 
      data: serviceData.historical.preProduction,
      total: getTotalValue(serviceData.historical.preProduction)
    },
    { 
      id: 'production', 
      title: 'Production', 
      value: serviceData.current.production, 
      data: serviceData.historical.production,
      total: getTotalValue(serviceData.historical.production)
    }
  ];

  const sortedEnvironments = isSorted 
    ? [...environments].sort((a, b) => b.total - a.total)
    : environments;

  return (
    <div className="min-h-screen bg-aqi-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-aqi-text">Service Requests Dashboard</h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSorted(!isSorted)}
              className="h-10"
            >
              <ArrowUpDown className="h-4 w-4" />
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {sortedEnvironments.map(env => (
            <SummaryCard
              key={env.id}
              title={env.title}
              value={env.value}
              unit="reqs/h"
              status={getRequestStatus(env.value)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEnvironments.map(env => (
            <SmallMultiple
              key={env.id}
              title={env.title}
              data={env.data}
              color="#2AB4FF"
              unit="reqs/h"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
