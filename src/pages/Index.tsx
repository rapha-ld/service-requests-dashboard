
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

// Mock data generator for monthly service requests
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

// Get the most recent value from historical data
const getMostRecentValue = (data: Array<{ day: string; value: number }>) => {
  return data[data.length - 1]?.value || 0;
};

const Dashboard = () => {
  const [date, setDate] = useState<Date>(new Date());

  // Simulate data fetching with React Query
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

  return (
    <div className="min-h-screen bg-aqi-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-aqi-text">Service Requests Dashboard</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'MMMM yyyy') : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                fromMonth={new Date(new Date().getFullYear(), 0)}
                toMonth={new Date(new Date().getFullYear(), 11)}
                numberOfMonths={1}
                fixedWeeks
                captionLayout="dropdown-buttons"
                showOutsideDays={false}
                disabled={(date) => date.getFullYear() !== new Date().getFullYear()}
                modifiers={{
                  selected: (date) => 
                    date.getMonth() === date.getMonth() &&
                    date.getFullYear() === date.getFullYear()
                }}
                modifiersStyles={{
                  selected: { backgroundColor: 'transparent' }
                }}
                hideHead={true}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Development"
            value={serviceData.current.development}
            unit="reqs/h"
            status={getRequestStatus(serviceData.current.development)}
          />
          <SummaryCard
            title="Staging"
            value={serviceData.current.staging}
            unit="reqs/h"
            status={getRequestStatus(serviceData.current.staging)}
          />
          <SummaryCard
            title="Pre-Production"
            value={serviceData.current.preProduction}
            unit="reqs/h"
            status={getRequestStatus(serviceData.current.preProduction)}
          />
          <SummaryCard
            title="Production"
            value={serviceData.current.production}
            unit="reqs/h"
            status={getRequestStatus(serviceData.current.production)}
          />
        </div>

        {/* Small Multiples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallMultiple
            title="Development"
            data={serviceData.historical.development}
            color="#2AB4FF"
            unit="reqs/h"
          />
          <SmallMultiple
            title="Staging"
            data={serviceData.historical.staging}
            color="#2AB4FF"
            unit="reqs/h"
          />
          <SmallMultiple
            title="Pre-Production"
            data={serviceData.historical.preProduction}
            color="#2AB4FF"
            unit="reqs/h"
          />
          <SmallMultiple
            title="Production"
            data={serviceData.historical.production}
            color="#2AB4FF"
            unit="reqs/h"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
