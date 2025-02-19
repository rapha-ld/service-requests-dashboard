
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";

// Mock data generator for monthly service requests
const generateMockMonthlyData = (baseValue: number) => {
  return Array.from({ length: 31 }, (_, i) => ({
    day: `${i + 1}`,
    value: Math.max(0, baseValue + Math.floor(Math.random() * 20 - 10))
  }));
};

const getRequestStatus = (value: number) => {
  if (value <= 10) return 'good';
  if (value <= 20) return 'moderate';
  return 'poor';
};

const Dashboard = () => {
  // Simulate data fetching with React Query
  const { data: serviceData } = useQuery({
    queryKey: ['service-data'],
    queryFn: () => ({
      current: {
        development: 15,
        staging: 8,
        preProduction: 5,
        production: 3
      },
      historical: {
        development: generateMockMonthlyData(15),
        staging: generateMockMonthlyData(8),
        preProduction: generateMockMonthlyData(5),
        production: generateMockMonthlyData(3)
      }
    }),
    initialData: {
      current: {
        development: 15,
        staging: 8,
        preProduction: 5,
        production: 3
      },
      historical: {
        development: generateMockMonthlyData(15),
        staging: generateMockMonthlyData(8),
        preProduction: generateMockMonthlyData(5),
        production: generateMockMonthlyData(3)
      }
    }
  });

  return (
    <div className="min-h-screen bg-aqi-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-aqi-text mb-6">Service Requests Dashboard</h1>
        
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
